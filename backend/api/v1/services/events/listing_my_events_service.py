from sqlmodel import Boolean, Session, and_, case, func, literal, or_, select

from backend.core.constants import (
    EventStatusCode,
    TagAssociationEntityCode,
    TransactionStatusCode,
)
from backend.models import Bookmark, Event, Organization, Ticket, User
from backend.models.application import Application
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation
from backend.models.transaction import Transaction
from backend.models.transaction_item import TransactionItem
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
    transaction_histories = (
        db.exec(
            select(
                func.max(Application.event_id).label("event_id"),
                Transaction.id,
                Transaction.status.label("transaction_status"),
                Transaction.total_amount,
                Transaction.created_at.label("purchased_at"),
                Transaction.quantity,
                func.json_agg(
                    func.json_build_object(
                        "id",
                        TransactionItem.id,
                        "ticket_name",
                        Ticket.name,
                        "ticket_id",
                        Ticket.id,
                        "ticket_price",
                        Ticket.price,
                        "ticket_type",
                        Ticket.type,
                        "event_access_link_url",
                        Ticket.access_link_url,
                        "amount",
                        TransactionItem.amount,
                        "note",
                        TransactionItem.note,
                    )
                ).label("ticket_transaction_items"),
            )
            .select_from(Transaction)
            .join(Application, Application.id == Transaction.application_id)
            .join(TransactionItem, TransactionItem.transaction_id == Transaction.id)
            .join(Ticket, Ticket.id == TransactionItem.ticket_id)
            .where(Application.user_id == current_user.id)
            .group_by(Transaction.id)
        )
        .mappings()
        .all()
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
                (EventTags.c.tags.is_(None), literal("[]")),
                else_=EventTags.c.tags,
            ).label("tags"),
        )
        .select_from(Event)
        .join(Organization, Event.organization_id == Organization.id)
        .outerjoin(
            Bookmark,
            and_(Bookmark.event_id == Event.id, Bookmark.user_id == current_user.id),
        )
        .outerjoin(Application, Application.event_id == Event.id)
        .outerjoin(EventTags, EventTags.c.event_id == Event.id)
        .where(*filters)
        .limit(query_params.per_page)
        .offset(query_params.per_page * (query_params.page - 1))
        .order_by(Event.start_at)
    )

    my_events = db.exec(query).mappings().all()

    my_events = [dict(event) for event in my_events]
    for event in my_events:
        event["transaction_histories"] = [
            {
                "id": transaction["id"],
                "transaction_status": transaction["transaction_status"],
                "total_amount": transaction["total_amount"],
                "purchased_at": transaction["purchased_at"],
                "quantity": transaction["quantity"],
                "ticket_transaction_items": transaction["ticket_transaction_items"],
            }
            for transaction in transaction_histories
            if transaction["event_id"] == event["id"]
        ]

        if (
            len(event["transaction_histories"]) > 0
            and event["transaction_histories"][0]["transaction_status"]
            == TransactionStatusCode.SUCCESS
        ):
            event["is_applied"] = True

    return my_events


async def _count_events(
    db: Session,
    filters: list,
):
    total = (
        db.scalar(
            select(func.count(Event.id))
            .select_from(Event)
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
