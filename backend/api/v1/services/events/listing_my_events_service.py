from sqlmodel import Boolean, Session, and_, case, desc, func, literal, or_, select

from backend.core.constants import EventStatusCode, TagAssociationEntityCode
from backend.models import Bookmark, Event, Organization, Ticket, User
from backend.models.application import Application
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation
from backend.models.transaction import Transaction
from backend.schemas.event import ListingMyEventsQueryParams, MyEventStatusCode


async def listing_my_events(
    db: Session, current_user: User, query_params: ListingMyEventsQueryParams
):
    filters = await _build_filters(current_user, query_params)
    events = await _listing_events(db, current_user, filters, query_params)
    total = await _count_events(db, filters)
    return events, total


async def _listing_events(
    db: Session,
    current_user: User,
    filters: list,
    query_params: ListingMyEventsQueryParams,
):
    TicketTransactions = (
        select(
            Application.event_id.label("event_id"),
            func.json_agg(
                func.json_build_object(
                    "ticket_id",
                    Ticket.id,
                    "ticket_name",
                    Ticket.name,
                    "ticket_price",
                    Ticket.price,
                    "ticket_type",
                    Ticket.type,
                    "event_access_link_url",
                    Ticket.access_link_url,
                    "ticket_description",
                    Ticket.description,
                    "transaction_id",
                    Transaction.id,
                    "purchased_quantity",
                    Transaction.quantity,
                    "total_amount",
                    Transaction.total_amount,
                    "purchased_at",
                    Transaction.created_at,
                    "transaction_status",
                    Transaction.status,
                )
            ).label("ticket_transactions"),
        )
        .join(Transaction, Transaction.ticket_id == Ticket.id)
        .join(Application, Application.id == Transaction.application_id)
        .where(Application.user_id == current_user.id)
        .group_by(Application.event_id, Transaction.created_at)
        .order_by(desc(Transaction.created_at))
        .cte()
    )

    EventTags = (
        select(
            TagAssociation.entity_id.label("event_id"),
            func.json_agg(func.json_build_object("id", Tag.id, "name", Tag.name)).label(
                "tags"
            ),
        )
        .join(Tag, Tag.id == TagAssociation.tag_id)
        .where(TagAssociation.entity_code == TagAssociationEntityCode.EVENT)
        .group_by(TagAssociation.entity_id)
        .cte()
    )

    # Only take care of the total tickets sold of events that the user has applied
    TotalTicketsSold = (
        select(
            Application.event_id,
            func.sum(Transaction.quantity).label("total_tickets_sold"),
        )
        .join(Application, Application.id == Transaction.application_id)
        .where(Application.user_id == current_user.id)
        .group_by(Application.event_id)
        .cte()
    )

    query = (
        select(
            Event.id,
            Event.slug,
            Organization.name.label("organization_name"),
            Event.name,
            Event.start_at,
            Event.end_at,
            Event.application_start_at,
            Event.application_end_at,
            Event.total_ticket_number,
            Event.cover_image_url,
            Event.organize_place_name,
            Event.organize_address,
            Event.organize_city_code,
            Event.is_online,
            Event.is_offline,
            Event.meeting_tool_code,
            Event.published_at,
            case(
                (
                    Bookmark.user_id.cast(Boolean),
                    True,
                ),
                else_=False,
            ).label("is_bookmarked"),
            case(
                (TicketTransactions.c.ticket_transactions.is_(None), literal("[]")),
                else_=TicketTransactions.c.ticket_transactions,
            ).label("ticket_transactions"),
            case(
                (EventTags.c.tags.is_(None), literal("[]")),
                else_=EventTags.c.tags,
            ).label("tags"),
            case(
                (
                    TicketTransactions.c.ticket_transactions.is_(None),
                    False,
                ),
                else_=True,
            ).label("is_applied"),
            TotalTicketsSold.c.total_tickets_sold,
        )
        .join(Organization, Event.organization_id == Organization.id)
        .outerjoin(
            Bookmark,
            and_(Bookmark.event_id == Event.id, Bookmark.user_id == current_user.id),
        )
        .outerjoin(Application, Application.event_id == Event.id)
        .outerjoin(TicketTransactions, TicketTransactions.c.event_id == Event.id)
        .outerjoin(EventTags, EventTags.c.event_id == Event.id)
        .outerjoin(TotalTicketsSold, TotalTicketsSold.c.event_id == Event.id)
        .where(*filters)
        .limit(query_params.per_page)
        .offset(query_params.per_page * (query_params.page - 1))
        .order_by(Event.start_at)
    )

    my_events = db.exec(query).mappings().all()

    return my_events


async def _count_events(
    db: Session,
    filters: list,
):
    total = (
        db.scalar(
            select(func.count(Event.id))
            .outerjoin(Bookmark, Event.id == Bookmark.event_id)
            .outerjoin(Application, Application.event_id == Event.id)
            .where(*filters)
        )
        or 0
    )
    return total


async def _build_filters(current_user: User, query_params: ListingMyEventsQueryParams):
    filters = [
        Event.status == EventStatusCode.PUBLIC,
        Event.published_at.isnot(None),
        or_(
            Application.user_id == current_user.id, Bookmark.user_id == current_user.id
        ),
    ]

    if query_params.keyword:
        filters.append(Event.name.contains(query_params.keyword))

    if query_params.status == MyEventStatusCode.BOOKMARKED:
        filters.append(Bookmark.user_id == current_user.id)

    # if query_params.status == MyEventStatusCode.APPLIED:
    #     filters.append(
    #         and_(
    #             Application.canceled_at.is_(None),
    #             Application.user_id == current_user.id,
    #             # Application.status == ApplicationStatusCode.APPROVED,
    #         )
    #     )

    # if query_params.status == MyEventStatusCode.ENDED:
    #     filters.append(
    #         and_(
    #             or_(
    #                 Application.user_id == current_user.id,
    #                 Bookmark.user_id == current_user.id,
    #             ),
    #             Event.end_at < datetime.now(pytz.utc),
    #         )
    #     )

    # if query_params.status == MyEventStatusCode.CANCELED:
    #     filters.append(
    #         and_(
    #             Application.canceled_at.isnot(None),
    #             Application.user_id == current_user.id,
    #             # Application.status == ApplicationStatusCode.REJECTED,
    #         )
    #     )
    # else:
    #     filters.append(
    #         and_(
    #             Application.canceled_at.is_(None),
    #             or_(
    #                 # Application.status != ApplicationStatusCode.REJECTED,
    #                 Application.status.is_(None),
    #             ),
    #         )
    #     )

    # if query_params.status == MyEventStatusCode.PENDING:
    #     filters.append(
    #         and_(
    #             Application.user_id == current_user.id,
    #             # Application.status == ApplicationStatusCode.PENDING,
    #         )
    #     )

    # if query_params.status == MyEventStatusCode.IN_PROGRESS:
    #     filters.append(
    #         and_(
    #             or_(
    #                 Application.user_id == current_user.id,
    #                 Bookmark.user_id == current_user.id,
    #             ),
    #             Event.start_at < datetime.now(pytz.utc),
    #             Event.end_at > datetime.now(pytz.utc),
    #         )
    #     )

    # if query_params.status == MyEventStatusCode.DEFERRED:
    #     filters.append(
    #         and_(
    #             or_(
    #                 Application.user_id == current_user.id,
    #                 Bookmark.user_id == current_user.id,
    #             ),
    #             Event.end_at > datetime.now(pytz.utc),
    #             Event.status == EventStatusCode.DEFERRED,
    #         )
    #     )

    return filters
