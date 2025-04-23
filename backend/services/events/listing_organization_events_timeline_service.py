from sqlmodel import Session, select

from backend.models.event import Event
from backend.models.user import User


async def listing_events_timeline(
    db: Session,
    organizer: User,
):
    events = (
        db.exec(
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
            ).where(Event.organization_id == organizer.organization_id),
        )
        .mappings()
        .all()
    )
    return events
