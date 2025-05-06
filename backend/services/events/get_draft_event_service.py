from datetime import datetime

from slugify import slugify
from sqlmodel import Session, select

import backend.services.tags as tag_service
import backend.services.tickets as ticket_service
from backend.core.constants import EventStatusCode
from backend.models import Event, User
from backend.utils.database import fetch_one, save


async def get_draft_event(db: Session, organizer: User, slug: str | None):
    try:
        query = select(Event).where(
            Event.organization_id == organizer.organization_id,
            Event.status == EventStatusCode.DRAFT,
        )

        if slug and slug != EventStatusCode.DRAFT:
            query = query.where(Event.slug == slug)

        event = fetch_one(db, query)

        if not event:
            name = f"Draft Event {datetime.now().strftime('%Y/%m/%d %H:%M')}"
            event = Event(
                organization_id=organizer.organization_id,
                status=EventStatusCode.DRAFT,
                name=name,
                slug=slugify(name),
            )
            event = save(db, event)
            event = dict(event)
        else:
            event = event.__dict__

        event["tickets"] = await ticket_service.listing_tickets_of_event(
            db, organizer, event["id"]
        )

        if len(event["tickets"]) == 0:
            ticket = await ticket_service.create_default_ticket(db, event["id"])
            ticket = dict(ticket)
            event["tickets"] = [ticket]

        event["tags"] = tag_service.get_event_tags(db, event["id"])
        event["gallery"] = event["gallery"] or []

        return event

    except Exception as e:
        db.rollback()
        raise e
