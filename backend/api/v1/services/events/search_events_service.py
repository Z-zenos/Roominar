from datetime import datetime

import pytz
from sqlmodel import Date, Session, and_, asc, case, desc, func, or_, select

from backend.core.constants import (
    EventSortByCode,
    EventStatusCode,
    TagAssociationEntityCode,
)
from backend.models.application import Application
from backend.models.bookmark import Bookmark
from backend.models.event import Event
from backend.models.organization import Organization
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation
from backend.models.target import Target
from backend.models.ticket_inventory import TicketInventory
from backend.models.user import User
from backend.schemas.event import SearchEventsQueryParams


async def search_events(
    db: Session,
    user: User | None,
    query_params: SearchEventsQueryParams,
):
    filters = _build_filters_sort(query_params)

    EventTag = (
        select(
            Event.id.label("event_id"),
            func.json_agg(
                func.json_build_object(
                    "id", Tag.id, "name", Tag.name, "image_url", Tag.image_url
                )
            ).label("tags"),
        )
        .select_from(Event)
        .join(TagAssociation, Event.id == TagAssociation.entity_id)
        .join(Tag, Tag.id == TagAssociation.tag_id)
        .where(TagAssociation.entity_code == TagAssociationEntityCode.EVENT)
        .group_by(Event.id)
        .cte()
    )

    SoldTicketsNumber = (
        select(
            TicketInventory.event_id,
            func.sum(TicketInventory.sold_quantity).label("sold_tickets_number"),
        )
        .select_from(TicketInventory)
        .group_by(TicketInventory.event_id)
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
            Event.total_ticket_number,
            Event.application_start_at,
            Event.application_end_at,
            Event.cover_image_url,
            Event.organize_city_code,
            Event.organize_address,
            Event.is_online,
            Event.is_offline,
            Event.meeting_tool_code,
            Event.published_at,
            EventTag.c.tags,
            SoldTicketsNumber.c.sold_tickets_number,
        )
        .join(Organization, Event.organization_id == Organization.id)
        .join(Target, Event.target_id == Target.id)
        .outerjoin(Application, Application.event_id == Event.id)
        .outerjoin(
            TagAssociation,
            and_(
                TagAssociation.entity_id == Event.id,
                TagAssociation.entity_code == TagAssociationEntityCode.EVENT,
            ),
        )
        .outerjoin(EventTag, Event.id == EventTag.c.event_id)
        .outerjoin(SoldTicketsNumber, Event.id == SoldTicketsNumber.c.event_id)
    )

    if user:
        query = query.add_columns(
            case(
                (
                    user and Bookmark.user_id == user.id,
                    True,
                ),
                else_=False,
            ).label("is_bookmarked")
        ).outerjoin(
            Bookmark, and_(Event.id == Bookmark.event_id, Bookmark.user_id == user.id)
        )

    query = (
        query.where(and_(*filters["conditions"]))
        .order_by(
            asc(filters["sort_by"])
            if query_params.sort_by == EventSortByCode.APPLICATION_END_AT
            else desc(filters["sort_by"])
        )
        .limit(query_params.per_page)
        .offset((query_params.page - 1) * query_params.per_page)
    )

    events = db.exec(query).mappings().all()

    result = {event.id: dict(event) for event in events}

    total = count_events(db, filters)
    return list(result.values()), total


def count_events(
    db: Session,
    filters: list,
):
    query = (
        select(func.count(Event.id.distinct()))
        .join(Organization, Event.organization_id == Organization.id)
        .join(Target, Event.target_id == Target.id)
        .outerjoin(
            TagAssociation,
            and_(
                Event.id == TagAssociation.entity_id,
                TagAssociation.entity_code == TagAssociationEntityCode.EVENT,
            ),
        )
        .where(and_(*filters["conditions"]))
    )
    total = db.scalars(query).one()

    return total


def _build_filters_sort(query_params: SearchEventsQueryParams):
    filters = [
        Event.published_at.isnot(None),
        Event.status == EventStatusCode.PUBLIC,
    ]
    sort_by = Event.published_at

    if query_params.keyword:
        filters.append(Event.name.contains(query_params.keyword))

    if query_params.is_online is True and query_params.is_offline is False:
        filters.append(Event.is_online == query_params.is_online)

    if query_params.is_offline is True and query_params.is_online is False:
        filters.append(Event.is_offline == query_params.is_offline)

    if query_params.is_offline is True and query_params.is_online is True:
        filters.append(
            and_(
                Event.is_online == query_params.is_online,
                Event.is_offline == query_params.is_offline,
            )
        )

    if query_params.is_apply_ongoing:
        filters.append(
            and_(
                Event.application_start_at <= datetime.now(pytz.utc),
                Event.application_end_at >= datetime.now(pytz.utc),
            ),
        )

    if query_params.is_apply_ended:
        filters.append(Event.application_end_at < datetime.now(pytz.utc))

    if query_params.is_today:
        filters.append(Event.start_at.date() == datetime.now(pytz.utc).date())

    if query_params.job_type_codes:
        filters.append(
            or_(Target.job_type_codes.any(code) for code in query_params.job_type_codes)
        )

    if query_params.industry_codes:
        filters.append(
            or_(Target.industry_codes.any(code) for code in query_params.industry_codes)
        )

    if query_params.city_codes:
        filters.append(Event.organize_city_code.in_(query_params.city_codes))

    if query_params.tags:
        filters.append(TagAssociation.tag_id.in_(query_params.tags))

    if query_params.start_at_from:
        filters.append(Event.start_at.cast(Date) >= query_params.start_at_from.date())

    if query_params.start_at_to:
        filters.append(Event.start_at.cast(Date) <= query_params.start_at_to.date())

    if query_params.sort_by == EventSortByCode.PUBLISHED_AT:
        filters.append(Event.end_at > datetime.now(pytz.utc))

    if query_params.sort_by == EventSortByCode.START_AT:
        filters.append(Event.start_at >= datetime.now(pytz.utc))
        sort_by = Event.start_at

    if query_params.sort_by == EventSortByCode.APPLICATION_END_AT:
        filters.append(Event.application_end_at >= datetime.now(pytz.utc))
        sort_by = Event.application_end_at

    return {
        "conditions": filters,
        "sort_by": sort_by,
    }
