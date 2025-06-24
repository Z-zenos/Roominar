from sqlmodel import Session, String, cast, func, select

from backend.models.check_in import CheckIn
from backend.models.event import Event
from backend.models.transaction import Transaction
from backend.models.transaction_item import TransactionItem
from backend.models.user import User
from backend.schemas.ticket import ListingEventPurchasedTicketsQueryParams


async def listing_event_purchased_tickets(
    db: Session,
    organizer: User,
    query_params: ListingEventPurchasedTicketsQueryParams,
    event_slug: int,
):
    filters = _build_filters(organizer, query_params, event_slug)
    event_purchased_tickets = await _get_event_purchased_tickets(
        db, filters, query_params
    )
    total = await count_event_purchased_tickets(db, filters)

    return event_purchased_tickets, total


async def count_event_purchased_tickets(db: Session, filters: list):
    query = (
        select(func.count(TransactionItem.id))
        .select_from(TransactionItem)
        .join(Transaction, TransactionItem.transaction_id == Transaction.id)
        .join(Event, Event.id == Transaction.event_id)
        .outerjoin(CheckIn, CheckIn.transaction_item_id == TransactionItem.id)
        .where(*filters)
    )

    total = db.scalar(query) or 0
    return total


async def _get_event_purchased_tickets(
    db: Session,
    filters: list,
    query_params: ListingEventPurchasedTicketsQueryParams,
):
    query = (
        select(
            TransactionItem.id.label("transaction_item_id"),
            CheckIn.created_at.label("checked_in_at"),
            CheckIn.id.label("check_in_id"),
        )
        .select_from(TransactionItem)
        .join(Transaction, TransactionItem.transaction_id == Transaction.id)
        .join(Event, Event.id == Transaction.event_id)
        .outerjoin(CheckIn, CheckIn.transaction_item_id == TransactionItem.id)
        .where(*filters)
    )

    if query_params.per_page:
        query = query.limit(query_params.per_page)
    if query_params.page:
        query = query.offset(query_params.per_page * (query_params.page - 1))

    event_purchased_tickets = db.exec(query).mappings().all()
    return event_purchased_tickets


def _build_filters(
    organizer: User,
    query_params: ListingEventPurchasedTicketsQueryParams,
    event_slug: str | None = None,
):
    filters = [
        Event.organization_id == organizer.organization_id,
        Event.slug == event_slug,
    ]
    if query_params.keyword:
        filters.append(
            cast(TransactionItem.id, String).ilike(f"%{query_params.keyword}%")
        )

    if query_params.is_checked_in:
        filters.append(CheckIn.created_at.isnot(None))

    return filters
