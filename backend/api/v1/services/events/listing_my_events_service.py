from datetime import datetime

import pytz
from sqlmodel import Boolean, Session, and_, case, func, or_, select

from backend.api.v1.services.events.search_events_service import _get_event_tags
from backend.core.constants import ApplicationStatusCode, EventStatusCode
from backend.models import Application, Bookmark, Event, Organization, Ticket, User
from backend.schemas.event import ListingMyEventsQueryParams, MyEventStatusCode


def listing_my_events(
    db: Session, current_user: User, query_params: ListingMyEventsQueryParams
):
    filters = _build_filters(current_user, query_params)
    events = _listing_events(db, current_user, filters, query_params)
    total = _count_events(db, filters)
    return events, total


def _listing_events(
    db: Session,
    current_user: User,
    filters: list,
    query_params: ListingMyEventsQueryParams,
):
    AppliedNumber = (
        select(
            Event.id.label("event_id"),
            func.coalesce(func.count(Application.event_id), 0).label("applied_number"),
        )
        .outerjoin(Application, Event.id == Application.event_id)
        .where(
            Application.canceled_at.is_(None),
            Application.status == ApplicationStatusCode.CONFIRMED,
        )
        .group_by(Event.id)
        .subquery()
    )

    query = (
        select(
            Event.id,
            Event.slug,
            Organization.name.label("organization_name"),
            Ticket.name.label("ticket_name"),
            Event.name,
            Event.start_at,
            Event.end_at,
            Event.application_start_at,
            Event.application_end_at,
            AppliedNumber.c.applied_number,
            Application.id.label("application_id"),
            Event.application_number,
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
                    Application.user_id.cast(Boolean),
                    True,
                ),
                else_=False,
            ).label("is_applied"),
            case(
                (
                    Bookmark.user_id.cast(Boolean),
                    True,
                ),
                else_=False,
            ).label("is_bookmarked"),
        )
        .join(Organization, Event.organization_id == Organization.id)
        .outerjoin(AppliedNumber, Event.id == AppliedNumber.c.event_id)
        .outerjoin(
            Application,
            and_(
                Application.event_id == Event.id, Application.user_id == current_user.id
            ),
        )
        .outerjoin(
            Ticket,
            and_(Ticket.event_id == Event.id, Application.ticket_id == Ticket.id),
        )
        .outerjoin(
            Bookmark,
            and_(Bookmark.event_id == Event.id, Bookmark.user_id == current_user.id),
        )
        .where(*filters)
        .limit(query_params.per_page)
        .offset(query_params.per_page * (query_params.page - 1))
        .order_by(Event.start_at)
    )
    events = db.exec(query).mappings().all()

    result = {event.id: dict(event) for event in events}
    event_ids = list(result.keys())
    event_tags = _get_event_tags(db, event_ids=event_ids)

    for item in event_tags:
        result[item.id]["tags"] = item.tags

    return list(result.values())


def _count_events(
    db: Session,
    filters: list,
):
    total = (
        db.scalar(
            select(func.count(Event.id))
            .outerjoin(Application, Event.id == Application.event_id)
            .outerjoin(Bookmark, Event.id == Bookmark.event_id)
            .where(*filters)
        )
        or 0
    )
    return total


def _build_filters(current_user: User, query_params: ListingMyEventsQueryParams):
    filters = [Event.status == EventStatusCode.PUBLIC, Event.published_at.isnot(None)]

    if query_params.keyword:
        filters.append(Event.name.contains(query_params.keyword))

    if query_params.status == MyEventStatusCode.BOOKMARKED:
        filters.append(Bookmark.user_id == current_user.id)

    if query_params.status == MyEventStatusCode.APPLIED:
        filters.append(
            and_(
                Application.canceled_at.is_(None),
                Application.user_id == current_user.id,
                Application.status == ApplicationStatusCode.CONFIRMED,
            )
        )

    if query_params.status == MyEventStatusCode.ENDED:
        filters.append(
            and_(
                or_(
                    Application.user_id == current_user.id,
                    Bookmark.user_id == current_user.id,
                ),
                Event.end_at < datetime.now(pytz.utc),
            )
        )

    if query_params.status == MyEventStatusCode.CANCELED:
        filters.append(
            and_(
                Application.canceled_at.isnot(None),
                Application.user_id == current_user.id,
                Application.status == ApplicationStatusCode.CANCELED,
            )
        )

    if query_params.status == MyEventStatusCode.PENDING:
        filters.append(
            and_(
                Application.user_id == current_user.id,
                Application.status == ApplicationStatusCode.PENDING,
            )
        )

    if query_params.status == MyEventStatusCode.IN_PROGRESS:
        filters.append(
            and_(
                or_(
                    Application.user_id == current_user.id,
                    Bookmark.user_id == current_user.id,
                ),
                Event.start_at < datetime.now(pytz.utc),
                Event.end_at > datetime.now(pytz.utc),
            )
        )

    if query_params.status == MyEventStatusCode.DEFERRED:
        filters.append(
            and_(
                or_(
                    Application.user_id == current_user.id,
                    Bookmark.user_id == current_user.id,
                ),
                Event.end_at > datetime.now(pytz.utc),
                Event.status == EventStatusCode.DEFERRED,
            )
        )

    return filters
