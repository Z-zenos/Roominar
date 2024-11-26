from datetime import datetime

from sqlmodel import Date, Session, func, select, text

from backend.api.v1.services.tags.get_event_tags_service import get_event_tags
from backend.core.constants import (
    ApplicationStatusCode,
    EventTimeStatusCode,
    ManageEventSortByCode,
)
from backend.models.application import Application
from backend.models.event import Event
from backend.models.event_tag import EventTag
from backend.models.user import User
from backend.schemas.event import ListingOrganizationEventsQueryParams


async def listing_organization_events(
    db: Session, organizer: User, query_params: ListingOrganizationEventsQueryParams
):
    filters, sort_by = _build_filters(organizer, query_params)
    events = await _listing_events(db, filters, sort_by, query_params)
    total = await _count_events(db, filters)

    return events, total


async def _listing_events(
    db: Session,
    filters: list,
    sort_by,
    query_params: ListingOrganizationEventsQueryParams,
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
            Event.name,
            Event.cover_image_url,
            Event.start_at,
            Event.end_at,
            Event.application_start_at,
            Event.application_end_at,
            Event.is_online,
            Event.is_offline,
            Event.organize_city_code,
            Event.organize_place_name,
            Event.application_number,
            AppliedNumber.c.applied_number,
            Event.status,
            Event.view_number,
            Event.meeting_tool_code,
        )
        .outerjoin(AppliedNumber, Event.id == AppliedNumber.c.event_id)
        .where(*filters)
        .limit(query_params.per_page)
        .offset(query_params.per_page * (query_params.page - 1))
        .order_by(sort_by)
    )

    events = db.exec(query).mappings().all()

    result = {event.id: dict(event) for event in events}
    event_ids = list(result.keys())
    event_tags = get_event_tags(db, event_ids=event_ids)

    for item in event_tags:
        result[item.id]["tags"] = item.tags

    return list(result.values())


async def _count_events(db: Session, filters: list):
    query = (
        select(func.count(Event.id.distinct()))
        .outerjoin(EventTag, Event.id == EventTag.event_id)
        .where(*filters)
    )
    total = db.scalar(query) or 0

    return total


def _build_filters(
    organizer: User,
    query_params: ListingOrganizationEventsQueryParams,
):
    filters = [Event.organization_id == organizer.organization_id]
    sort_by = Event.created_at

    if query_params.keyword:
        filters.append(Event.name.contains(query_params.keyword))

    if query_params.tags:
        filters.append(EventTag.tag_id.in_(query_params.tags))

    if query_params.meeting_tool_codes:
        filters.append(Event.meeting_tool_code.in_(query_params.meeting_tool_codes))

    if query_params.start_at_from:
        filters.append(Event.start_at.cast(Date) >= query_params.start_start_at.date())

    if query_params.start_at_to:
        filters.append(Event.start_at.cast(Date) <= query_params.end_start_at.date())

    if query_params.event_status:
        filters.append(Event.status.in_(query_params.event_status))

    if query_params.time_status == EventTimeStatusCode.UPCOMING:
        filters.append(Event.application_start_at > datetime.now())

    if query_params.time_status == EventTimeStatusCode.IN_PROGRESS:
        filters.extend([Event.start_at < datetime.now(), Event.end_at > datetime.now()])

    if query_params.time_status == EventTimeStatusCode.APPLY_ONGOING:
        filters.extend(
            [
                Event.application_start_at < datetime.now(),
                Event.application_end_at > datetime.now(),
            ]
        )

    if query_params.time_status == EventTimeStatusCode.ALL_ENDED:
        filters.append(Event.end_at < datetime.now())

    if query_params.sort_by == ManageEventSortByCode.APPLIED_NUMBER:
        sort_by = text("applied_numbers.applied_number")

    if query_params.sort_by == ManageEventSortByCode.START_AT:
        sort_by = Event.start_at

    if query_params.sort_by == ManageEventSortByCode.NAME:
        sort_by = Event.name

    if query_params.sort_by == ManageEventSortByCode.VIEW_NUMBER:
        sort_by = Event.view_number

    return filters, sort_by
