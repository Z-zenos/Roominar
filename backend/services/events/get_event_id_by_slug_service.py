from sqlmodel import Session, select

from backend.models.event import Event
from backend.utils.database import fetch_one


async def get_event_id_by_slug(db: Session, slug: str):
    event = fetch_one(db, select(Event).where(Event.slug == slug))
    return event.id
