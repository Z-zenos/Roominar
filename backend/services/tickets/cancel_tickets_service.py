from datetime import datetime

import pytz
from sqlmodel import Session, select, update

from backend.core.constants import TransactionStatusCode, UserActionTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.ticket_inventory import TicketInventory
from backend.models.transaction_item import TransactionItem
from backend.models.user import User
from backend.models.user_action import UserAction
from backend.schemas.ticket import CancelTicketsRequest


async def cancel_tickets(db: Session, user: User, request: CancelTicketsRequest):
    try:
        ticket = (
            db.exec(
                select(
                    TransactionItem.id.label("transaction_item_id"),
                    TransactionItem.status,
                    Ticket.id,
                    Ticket.type,
                    Ticket.price,
                    Event.start_at,
                    Ticket.cancelable_before_at,
                    Event.id.label("event_id"),
                    Event.organization_id,
                    TicketInventory.available_quantity,
                    TicketInventory.canceled_quantity,
                )
                .join(TransactionItem, TransactionItem.ticket_id == Ticket.id)
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

        if (ticket["start_at"] < datetime.now(pytz.utc)) or (
            ticket["cancelable_before_at"] < datetime.now(pytz.utc)
        ):
            raise BadRequestException(
                ErrorCode.ERR_INVALID_CANCEL_TICKET_DATETIME,
                ErrorMessage.ERR_INVALID_CANCEL_TICKET_DATETIME,
            )

        db.exec(
            update(TransactionItem)
            .where(TransactionItem.id == ticket["transaction_item_id"])
            .values(
                status=TransactionStatusCode.CANCELED,
                canceled_at=datetime.now(),
                cancel_reason_code=request.reason,
            )
        )

        db.exec(
            update(TicketInventory)
            .where(
                TicketInventory.ticket_id == ticket["id"],
            )
            .values(
                available_quantity=ticket["available_quantity"] + 1,
                canceled_quantity=ticket["canceled_quantity"] + 1,
            )
        )

        db.exec(
            update(Event)
            .where(Event.id == ticket["event_id"])
            .values(sold_ticket_count=Event.sold_ticket_count - 1)
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
