from datetime import datetime

from sqlmodel import Date, Session, and_, case, func, select, text

from backend.core.constants import (
    EventTimeStatusCode,
    ManageEventSortByCode,
    TagAssociationEntityCode,
)
from backend.models.event import Event
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation
from backend.models.ticket import Ticket
from backend.models.ticket_inventory import TicketInventory
from backend.models.user import User
from backend.schemas.event import ListingOrganizationEventsQueryParams


async def listing_organization_events(
    db: Session, organizer: User, query_params: ListingOrganizationEventsQueryParams
):
    filters, sort_by = _build_filters_sort(organizer, query_params)
    events = await _listing_events(db, filters, sort_by, query_params)
    total = await _count_events(db, filters)

    return events, total


async def _listing_events(
    db: Session,
    filters: list,
    sort_by: ManageEventSortByCode,
    query_params: ListingOrganizationEventsQueryParams,
):
    EventTicket = (
        select(
            Event.id.label("event_id"),
            func.json_agg(
                func.json_build_object(
                    "id",
                    Ticket.id,
                    "name",
                    Ticket.name,
                    "price",
                    Ticket.price,
                    "quantity",
                    Ticket.quantity,
                    "available_quantity",
                    TicketInventory.available_quantity,
                    "type",
                    Ticket.type,
                )
            ).label("tickets"),
        )
        .outerjoin(TicketInventory, TicketInventory.event_id == Event.id)
        .join(Ticket, Ticket.id == TicketInventory.ticket_id)
        .group_by(Event.id)
        .subquery()
    )

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
        .join(TagAssociation, and_(Event.id == TagAssociation.entity_id))
        .join(Tag, Tag.id == TagAssociation.tag_id)
        .where(TagAssociation.entity_code == TagAssociationEntityCode.EVENT)
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
            Event.organize_address,
            Event.total_ticket_number,
            Event.status,
            Event.view_number,
            Event.meeting_tool_code,
            Event.meeting_url,
            case(
                (EventTicket.c.tickets.is_(None), "[]"),
                else_=EventTicket.c.tickets,
            ),
            case(
                (EventTag.c.tags.is_(None), "[]"),
                else_=EventTag.c.tags,
            ),
        )
        .outerjoin(EventTicket, Event.id == EventTicket.c.event_id)
        .outerjoin(EventTag, Event.id == EventTag.c.event_id)
        .where(*filters)
        .limit(query_params.per_page)
        .offset(query_params.per_page * (query_params.page - 1))
        .order_by(sort_by)
    )
    events = db.exec(query).mappings().all()

    result = {event.id: dict(event) for event in events}

    return list(result.values())


async def _count_events(db: Session, filters: list):
    query = (
        select(func.count(Event.id.distinct()))
        .outerjoin(
            TagAssociation,
            and_(
                Event.id == TagAssociation.tag_id,
                TagAssociation.entity_code == TagAssociationEntityCode.EVENT,
            ),
        )
        .where(*filters)
    )
    total = db.scalar(query) or 0

    return total


def _build_filters_sort(
    organizer: User,
    query_params: ListingOrganizationEventsQueryParams,
):
    filters = [Event.organization_id == organizer.organization_id]
    sort_by = Event.created_at

    if query_params.keyword:
        filters.append(Event.name.contains(query_params.keyword))

    if query_params.tags:
        filters.append(TagAssociation.tag_id.in_(query_params.tags))

    if query_params.meeting_tool_codes:
        filters.append(Event.meeting_tool_code.in_(query_params.meeting_tool_codes))

    if query_params.start_at_from:
        filters.append(Event.start_at.cast(Date) >= query_params.start_at_from.date())

    if query_params.start_at_to:
        filters.append(Event.start_at.cast(Date) <= query_params.start_at_to.date())

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

    if query_params.sort_by == ManageEventSortByCode.SOLD_TICKETS_NUMBER:
        sort_by = text("sold_tickets_number.sold_tickets_number")

    if query_params.sort_by == ManageEventSortByCode.START_AT:
        sort_by = Event.start_at

    if query_params.sort_by == ManageEventSortByCode.NAME:
        sort_by = Event.name

    if query_params.sort_by == ManageEventSortByCode.VIEW_NUMBER:
        sort_by = Event.view_number

    return filters, sort_by
