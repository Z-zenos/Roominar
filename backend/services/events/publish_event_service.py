from datetime import datetime

from geoalchemy2.shape import from_shape
from shapely.geometry import Point
from sqlmodel import Session, delete, select

from backend.core.constants import EventStatusCode, TagAssociationEntityCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models import Event, Tag, User
from backend.models.tag_association import TagAssociation
from backend.models.ticket import Ticket
from backend.models.ticket_inventory import TicketInventory
from backend.schemas.event import PublishEventRequest
from backend.utils.database import fetch_all, fetch_one, save


async def publish_event(
    db: Session, organizer: User, request: PublishEventRequest, event_id: int
):
    try:
        event = fetch_one(
            db,
            select(Event).where(
                Event.id == event_id, Event.organization_id == organizer.organization_id
            ),
        )

        if not event:
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NOT_FOUND, ErrorMessage.ERR_EVENT_NOT_FOUND
            )

        Event.update_by_dict(event, request.model_dump())
        event.organization_id = organizer.organization_id
        event.published_at = datetime.now()
        event.status = EventStatusCode.PUBLIC
        event.updated_at = datetime.now()
        event.updated_by = organizer.id

        if request.lat and request.lng:
            # event.coordinate = f"POINT({request.lng} {request.lat})"
            event.coordinate = from_shape(Point(request.lng, request.lat), srid=4326)

        if request.tags:
            # Remove existing tags associated with the event
            db.exec(
                delete(TagAssociation)
                .where(TagAssociation.entity_id == event_id)
                .where(TagAssociation.entity_code == TagAssociationEntityCode.EVENT)
            )

            db.flush()

            # Add new tags
            request_tags = db.exec(select(Tag.id).where(Tag.id.in_(request.tags))).all()
            if (not request_tags) or (len(request.tags) != len(request_tags)):
                raise BadRequestException(ErrorCode.ERR_TAG_NOT_FOUND)
            tags = [
                TagAssociation(
                    entity_id=event_id,
                    tag_id=tag_id,
                    entity_code=TagAssociationEntityCode.EVENT,
                )
                for tag_id in request.tags
            ]
            db.add_all(tags)

        tickets = fetch_all(
            db,
            select(Ticket)
            .join(Event, Event.id == Ticket.event_id)
            .where(
                Ticket.event_id == event_id,
            ),
        )

        ticket_inventories = []
        for ticket in tickets:
            ticket = dict(ticket)
            ticket_inventory = TicketInventory(
                ticket_id=ticket["id"],
                event_id=event_id,
                available_quantity=ticket["quantity"],
            )
            ticket_inventories.append(ticket_inventory)
            event.total_ticket_number = 0
            event.total_ticket_number += ticket["quantity"]
        db.add_all(ticket_inventories)

        db.flush()
        save(db, event)

        return event.id

    except Exception as e:
        db.rollback()
        raise e
