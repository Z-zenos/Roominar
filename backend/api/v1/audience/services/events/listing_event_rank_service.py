from sqlmodel import Session, column, desc, distinct, func, select

from backend.core.constants import EventStatusCode
from backend.models.application import Application
from backend.models.bookmark import Bookmark
from backend.models.event import Event


async def listing_event_rank(db: Session):
    top_events = (
        db.exec(
            select(
                distinct(Event.id).label("id"),
                Event.slug,
                Event.name,
                (
                    5000 * func.count(Application.id)
                    + 500 * func.count(Bookmark.id)
                    + Event.view_number
                ).label("rank"),
            )
            .outerjoin(Application, Event.id == Application.event_id)
            .outerjoin(Bookmark, Event.id == Bookmark.event_id)
            .where(
                Event.public_at.isnot(None),
                Event.status == EventStatusCode.PUBLIC,
                Application.canceled_at.is_(None),
            )
            .group_by(Event.id, Application.id, Bookmark.id)
            .order_by(desc(column("rank")))
            .limit(5)
        )
        .mappings()
        .all()
    )

    return top_events
