from sqlmodel import Session, func, or_, select

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
