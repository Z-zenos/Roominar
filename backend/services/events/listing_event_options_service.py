from sqlmodel import Session, select

from backend.models.event import Event
from backend.models.user import User


async def listing_event_options(db: Session, organizer: User):
    event_options = (
        db.exec(
            select(Event.id, Event.name).where(
                Event.organization_id == organizer.organization_id
            )
        )
        .mappings()
        .all()
    )

    event_options.insert(0, {"id": 0, "name": "All events"})

    return event_options
