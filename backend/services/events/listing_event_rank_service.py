from sqlmodel import Session, column, desc, distinct, func, select

from backend.core.constants import EventStatusCode
from backend.core.simple_cache import CacheKeys, cached_response
from backend.models.application import Application
from backend.models.bookmark import Bookmark
from backend.models.event import Event
from backend.utils.database import transaction_scope


@cached_response(
    cache_key=CacheKeys.EVENTS_RANK,
    ttl=900,  # 15 minutes
    include_user=False,
    include_params=False,
)
def listing_event_rank(db: Session):
    """Get top ranked events based on applications, bookmarks, and views"""

    with transaction_scope() as session:
        top_events = (
            session.exec(
                select(
                    distinct(Event.id).label("id"),
                    Event.slug,
                    Event.name,
                    (
                        5000 * func.count(Application.id)
                        + 500 * func.count(Bookmark.id)
                        + Event.view_count
                    ).label("rank"),
                )
                .outerjoin(Application, Event.id == Application.event_id)
                .outerjoin(Bookmark, Event.id == Bookmark.event_id)
                .where(
                    Event.published_at.isnot(None),
                    Event.status == EventStatusCode.PUBLIC,
                    # Application.canceled_at.is_(None),
                )
                .group_by(Event.id, Application.id, Bookmark.id)
                .order_by(desc(column("rank")))
                .limit(5)
            )
            .mappings()
            .all()
        )

        return list(top_events)
