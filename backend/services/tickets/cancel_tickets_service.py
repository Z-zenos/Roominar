from datetime import datetime

import pytz
import stripe
from sqlmodel import Session, select, update

from backend.core.config import settings
from backend.core.constants import (
    PaymentMethodCode,
    TicketCancellationPolicyCode,
    TransactionStatusCode,
    UserActionTypeCode,
)
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models import (
    CheckIn,
    Event,
    Ticket,
    TicketInventory,
    Transaction,
    TransactionItem,
    User,
    UserAction,
)
from backend.schemas.ticket import CancelTicketsRequest

stripe.api_key = settings.STRIPE_SECRET_KEY


async def cancel_tickets(db: Session, user: User, request: CancelTicketsRequest):
    try:
        now = datetime.now(pytz.utc)

        check_in = db.exec(
            select(CheckIn).where(
                CheckIn.transaction_item_id == request.transaction_item_id
            )
        ).one_or_none()
        if check_in:
            raise BadRequestException(
                ErrorCode.ERR_TICKET_ALREADY_CHECKED_IN,
                ErrorMessage.ERR_TICKET_ALREADY_CHECKED_IN,
            )

        ticket = (
            db.exec(
                select(
                    TransactionItem.id.label("transaction_item_id"),
                    TransactionItem.status,
                    TransactionItem.transaction_id,
                    TransactionItem.amount.label("ticket_price"),
                    Ticket.id,
                    Ticket.type,
                    Ticket.cancelable_before_at,
                    Ticket.cancellation_policy_code,
                    Ticket.refund_percentage,
                    Event.start_at.label("event_start_at"),
                    Event.id.label("event_id"),
                    Event.organization_id,
                    Event.sold_ticket_count,
                    TicketInventory.available_quantity,
                    TicketInventory.canceled_quantity,
                    Transaction.id.label("transaction_id"),
                    Transaction.payment_method_code,
                    Transaction.stripe_payment_intent_id,
                    Transaction.stripe_refund_id,
                )
                .join(TransactionItem, TransactionItem.ticket_id == Ticket.id)
                .join(Transaction, Transaction.id == TransactionItem.transaction_id)
                .join(Event, Event.id == Ticket.event_id)
                .join(TicketInventory, TicketInventory.ticket_id == Ticket.id)
                .where(
                    TransactionItem.id == request.transaction_item_id,
                    TransactionItem.user_id == user.id,
                )
            )
            .mappings()
            .one_or_none()
        )

        if not ticket:
            raise BadRequestException(
                ErrorCode.ERR_INVALID_TICKET,
                ErrorMessage.ERR_INVALID_TICKET,
            )

        if ticket["event_start_at"] < now or ticket["cancelable_before_at"] < now:
            raise BadRequestException(
                ErrorCode.ERR_INVALID_CANCEL_TICKET_DATETIME,
                ErrorMessage.ERR_INVALID_CANCEL_TICKET_DATETIME,
            )

        if ticket["stripe_refund_id"]:
            raise BadRequestException(
                ErrorCode.ERR_TICKET_ALREADY_REFUNDED,
                ErrorMessage.ERR_TICKET_ALREADY_REFUNDED,
            )

        if ticket["cancellation_policy_code"] == TicketCancellationPolicyCode.NO_REFUND:
            raise BadRequestException(
                ErrorCode.ERR_TICKET_NOT_REFUNDABLE,
                ErrorMessage.ERR_TICKET_NOT_REFUNDABLE,
            )

        refund_amount = ticket["ticket_price"]
        if (
            ticket["cancellation_policy_code"]
            == TicketCancellationPolicyCode.FULL_REFUND
        ):
            refund_amount = ticket["ticket_price"]
        if (
            ticket["cancellation_policy_code"]
            == TicketCancellationPolicyCode.PARTIAL_REFUND
        ):
            refund_amount = ticket["ticket_price"] * (ticket["refund_percentage"] / 100)

        if ticket["payment_method_code"] == PaymentMethodCode.STRIPE:
            refund = stripe.Refund.create(
                payment_intent=ticket["stripe_payment_intent_id"],
                reason="requested_by_customer",
                amount=int(refund_amount),
            )
            if refund.status != "succeeded":
                raise BadRequestException(
                    ErrorCode.ERR_STRIPE_REFUND_FAILED,
                    ErrorMessage.ERR_STRIPE_REFUND_FAILED,
                )

            db.exec(
                update(Transaction)
                .where(Transaction.id == ticket["transaction_id"])
                .values(
                    stripe_refund_id=refund.id,
                    status=TransactionStatusCode.REFUNDED,
                )
            )

        db.exec(
            update(User)
            .where(User.id == user.id)
            .values(
                point=user.point + refund_amount,
            )
        )

        db.exec(
            update(Transaction)
            .where(Transaction.id == ticket["transaction_id"])
            .values(
                status=(
                    TransactionStatusCode.REFUNDED
                    if ticket["payment_method_code"] == PaymentMethodCode.STRIPE
                    else TransactionStatusCode.CANCELED
                ),
            )
        )

        db.exec(
            update(TransactionItem)
            .where(TransactionItem.id == ticket["transaction_item_id"])
            .values(
                status=(
                    TransactionStatusCode.REFUNDED
                    if ticket["payment_method_code"] == PaymentMethodCode.STRIPE
                    else TransactionStatusCode.CANCELED
                ),
                canceled_at=now,
                cancel_reason_code=request.reason,
                refunded_amount=refund_amount,
                refunded_at=now,
            )
        )

        db.exec(
            update(TicketInventory)
            .where(TicketInventory.ticket_id == ticket["id"])
            .values(
                available_quantity=ticket["available_quantity"] + 1,
                canceled_quantity=ticket["canceled_quantity"] + 1,
            )
        )

        db.exec(
            update(Event)
            .where(Event.id == ticket["event_id"])
            .values(sold_ticket_count=ticket["sold_ticket_count"] - 1)
        )

        user_action = UserAction(
            user_id=user.id,
            event_id=ticket["event_id"],
            organization_id=ticket["organization_id"],
            action_type=UserActionTypeCode.CANCEL_TICKET,
            extra_info={
                "transaction_item_id": request.transaction_item_id,
                "reason": request.reason,
            },
        )
        db.add(user_action)

        db.commit()
        return request.transaction_item_id

    except Exception as e:
        db.rollback()
        raise e
