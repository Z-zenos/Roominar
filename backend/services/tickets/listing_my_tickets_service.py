from datetime import datetime, timezone

from sqlmodel import Session, func, or_, select

from backend.core.constants import TicketCancellationPolicyCode, TransactionStatusCode
from backend.models.application import Application
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.transaction import Transaction
from backend.models.transaction_item import TransactionItem
from backend.models.user import User
from backend.schemas.ticket import ListingMyTicketsQueryParams


async def listing_my_tickets(
    db: Session, user: User, query_params: ListingMyTicketsQueryParams
):
    filters = _build_filters(user, query_params)
    tickets = await _get_my_tickets(db, filters, query_params)
    total = await _count_my_tickets(db, filters)
    return tickets, total


async def _get_my_tickets(
    db: Session, filters: list, query_params: ListingMyTicketsQueryParams
):
    tickets = (
        db.exec(
            select(
                Ticket.id,
                Ticket.name,
                Ticket.price,
                Ticket.type,
                Ticket.cancellation_policy_code,
                Ticket.cancellation_policy_extra_description,
                Ticket.cancelable_before_at,
                Ticket.refund_method_code,
                Ticket.cancelation_fee,
                Ticket.refund_percentage,
                TransactionItem.status.label("transaction_status"),
                Ticket.description,
                TransactionItem.canceled_at,
                TransactionItem.cancel_reason_code,
                TransactionItem.refunded_at,
                TransactionItem.refunded_amount,
                TransactionItem.note,
                Event.name.label("event_name"),
                Event.cover_image_url.label("event_cover_image_url"),
                Event.id.label("event_id"),
                Event.slug.label("event_slug"),
                Event.start_at.label("event_start_at"),
                Event.end_at.label("event_end_at"),
                Event.application_start_at.label("event_application_start_at"),
                Event.application_end_at.label("event_application_end_at"),
                Application.id.label("application_id"),
                Application.created_at.label("applied_at"),
                TransactionItem.id.label("transaction_item_id"),
                Transaction.id.label("transaction_id"),
                Transaction.payment_method_code,
                Transaction.currency,
            )
            .select_from(TransactionItem)
            .join(Transaction, Transaction.id == TransactionItem.transaction_id)
            .join(Application, Application.id == Transaction.application_id)
            .join(Ticket, Ticket.id == TransactionItem.ticket_id)
            .join(Event, Event.id == Ticket.event_id)
            .where(*filters)
            .limit(query_params.per_page)
            .offset((query_params.page - 1) * query_params.per_page)
            .order_by(TransactionItem.created_at.desc())
        )
        .mappings()
        .all()
    )

    now = datetime.now(timezone.utc)
    tickets = [dict(ticket) for ticket in tickets]

    for ticket in tickets:
        if (
            ticket["canceled_at"]
            or ticket["transaction_status"] == TransactionStatusCode.CANCELED
        ):
            ticket["cancelable"] = False
            ticket["refundable_amount"] = 0.0
            continue

        ticket["cancelable_before_at"] = (
            ticket["cancelable_before_at"]
            if ticket["cancelable_before_at"]
            else ticket["event_start_at"]
        )
        cancelable_before = ticket["cancelable_before_at"]

        if ticket["cancellation_policy_code"] == "NON_TRANSFERABLE":
            ticket["cancelable"] = False
            ticket["refundable_amount"] = 0.0
            continue

        if now > cancelable_before:
            ticket["cancelable"] = False
            ticket["refundable_amount"] = 0.0
            continue

        ticket["cancelable"] = True

        if ticket["cancellation_policy_code"] == TicketCancellationPolicyCode.NO_REFUND:
            ticket["refundable_amount"] = 0.0
        elif (
            ticket["cancellation_policy_code"]
            == TicketCancellationPolicyCode.FULL_REFUND
        ):
            ticket["refundable_amount"] = ticket["price"]
        elif (
            ticket["cancellation_policy_code"]
            == TicketCancellationPolicyCode.PARTIAL_REFUND
        ):
            refund_rate = ticket["refund_percentage"] or 0.0
            ticket["refundable_amount"] = ticket["price"] * refund_rate
        elif (
            ticket["cancellation_policy_code"]
            == TicketCancellationPolicyCode.REFUND_BY_DATETIME
        ):
            days_before_event = (ticket["event_start_at"] - now).days
            if days_before_event >= 7:
                ticket["refundable_amount"] = ticket["price"] * 0.8
            elif days_before_event >= 3:
                ticket["refundable_amount"] = ticket["price"] * 0.5
            else:
                ticket["refundable_amount"] = 0.0

    return tickets


async def _count_my_tickets(db: Session, filters: list):
    total = db.scalar(select(func.count(TransactionItem.id)).where(*filters)) or 0

    return total


def _build_filters(user: User, query_params: ListingMyTicketsQueryParams):
    filters = [TransactionItem.user_id == user.id]

    if query_params.keyword:
        filters.append(
            or_(
                Event.name.contains(query_params.keyword),
                Ticket.name.contains(query_params.keyword),
            )
        )

    if query_params.status:
        filters.append(TransactionItem.status == query_params.status)

    return filters
