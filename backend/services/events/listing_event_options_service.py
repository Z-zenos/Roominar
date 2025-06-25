from sqlmodel import Session, select

from backend.core.simple_cache import CacheKeys, cached_response
from backend.models.event import Event
from backend.models.user import User
from backend.utils.database import transaction_scope


@cached_response(
    cache_key=CacheKeys.EVENT_OPTIONS,
    ttl=1800,  # 30 minutes
    include_user=True,
    include_params=False,
)
def listing_event_options(db: Session, organizer: User):
    """Get event options for organizer"""

    with transaction_scope() as session:
        results = session.exec(
            select(Event.id, Event.name).where(
                Event.organization_id == organizer.organization_id
            )
        ).all()

        events = [{"id": event[0], "name": event[1]} for event in results]

        return events
