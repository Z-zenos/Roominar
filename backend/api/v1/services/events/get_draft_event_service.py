from sqlmodel import Session, select

import backend.api.v1.services.tags as tag_service
import backend.api.v1.services.tickets as ticket_service
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models import Event, User
from backend.utils.database import fetch_one


async def get_draft_event(db: Session, organizer: User, slug: str):
    event = fetch_one(
        db,
        select(Event).where(
            Event.slug == slug, Event.organization_id == organizer.organization_id
        ),
    )

    if not event:
        raise BadRequestException(
            ErrorCode.ERR_EVENT_NOT_FOUND, ErrorMessage.ERR_EVENT_NOT_FOUND
        )

    event = event.dict()

    event["tickets"] = await ticket_service.listing_tickets_of_event(
        db, organizer, event["id"]
    )
    event["tags"] = tag_service.get_event_tags(db, event["id"])

    return event
