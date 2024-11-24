from sqlmodel import Session, column, desc, distinct, func, select

from backend.core.constants import EventStatusCode
from backend.models.application import Application
from backend.models.bookmark import Bookmark
from backend.models.event import Event


async def listing_top_organization_events(db: Session, organization_id: int):
    """
    rank = view * 1  +  bookmark * 500 + applied * 5000
    """

    top_events = (
        db.exec(
            select(
                distinct(Event.id).label("id"),
                Event.slug,
                Event.cover_image_url,
                Event.name,
                Event.start_at,
                (
                    5000 * func.count(Application.id)
                    + 500 * func.count(Bookmark.id)
                    + Event.view_number
                ).label("rank"),
            )
            .outerjoin(Application, Event.id == Application.event_id)
            .outerjoin(Bookmark, Event.id == Bookmark.event_id)
            .where(
                Event.published_at.isnot(None),
                Event.organization_id == organization_id,
                Event.status == EventStatusCode.PUBLIC,
                Application.canceled_at.is_(None),
            )
            .group_by(Event.id, Application.id, Bookmark.id)
            .order_by(desc(column("rank")))
            .limit(3)
        )
        .mappings()
        .all()
    )

    return top_events
