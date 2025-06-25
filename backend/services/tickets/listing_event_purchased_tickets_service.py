from sqlmodel import Session, String, cast, func, select

from backend.core.simple_cache import CacheKeys, cached_response
from backend.models.check_in import CheckIn
from backend.models.event import Event
from backend.models.transaction import Transaction
from backend.models.transaction_item import TransactionItem
from backend.models.user import User
from backend.schemas.ticket import ListingEventPurchasedTicketsQueryParams
from backend.utils.database import transaction_scope


@cached_response(
    cache_key=CacheKeys.TICKETS_LIST,
    ttl=300,  # 5 minutes for ticket data
    include_user=True,
    include_params=True,
)
def listing_event_purchased_tickets(
    db: Session,
    organizer: User,
    query_params: ListingEventPurchasedTicketsQueryParams,
    event_slug: str,
):
    """List purchased tickets for an event with caching"""

    with transaction_scope() as session:
        filters = _build_filters(organizer, query_params, event_slug)

        event_purchased_tickets = _get_event_purchased_tickets(
            session, filters, query_params
        )
        total = count_event_purchased_tickets(session, filters)

        return event_purchased_tickets, total


def count_event_purchased_tickets(db: Session, filters: list):
    """Count purchased tickets with filters"""

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


def _get_event_purchased_tickets(
    db: Session,
    filters: list,
    query_params: ListingEventPurchasedTicketsQueryParams,
):
    """Get purchased tickets with pagination"""

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

    # Apply pagination
    if query_params.per_page:
        query = query.limit(query_params.per_page)
    if query_params.page and query_params.per_page:
        query = query.offset(query_params.per_page * (query_params.page - 1))

    event_purchased_tickets = db.exec(query).mappings().all()
    return list(event_purchased_tickets)


def _build_filters(
    organizer: User,
    query_params: ListingEventPurchasedTicketsQueryParams,
    event_slug: str | None = None,
):
    """Build query filters for purchased tickets"""

    filters = [
        Event.organization_id == organizer.organization_id,
    ]

    # Add event slug filter if provided
    if event_slug:
        filters.append(Event.slug == event_slug)

    # Add keyword search filter
    if query_params.keyword:
        filters.append(
            cast(TransactionItem.id, String).ilike(f"%{query_params.keyword}%")
        )

    # Add check-in status filter
    if query_params.is_checked_in is not None:
        if query_params.is_checked_in:
            filters.append(CheckIn.created_at.isnot(None))
        else:
            filters.append(CheckIn.created_at.is_(None))

    return filters
