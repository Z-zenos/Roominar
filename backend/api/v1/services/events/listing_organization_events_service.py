from sqlmodel import Session, select, func

from backend.models.application import Application
from backend.models.bookmark import Bookmark
from backend.models.event import Event
from backend.models.user import User
from backend.utils.database import fetch_all


async def listing_organization_events(db: Session, organizer: User):
    events = await _listing_events(db, organizer)
    total = await _count_events(db, organizer)

    return events, total


async def _listing_events(db: Session, organizer: User):
    events = fetch_all(
        db,
        select(Event)
        .outerjoin(Application, Event.id == Application.event_id)
        .outerjoin(Bookmark, Event.id == Bookmark.event_id)
        .where(Event.organization_id == organizer.organization_id),
    )

    return events


async def _count_events(db: Session, organizer: User):
    query = select(func.count(Event.id)).where(
        Event.organization_id == organizer.organization_id
    )
    total = db.scalar(query) or 0

    return total
