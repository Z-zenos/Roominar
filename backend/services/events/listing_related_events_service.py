from sqlmodel import Session, func, select

from backend.core.constants import EventStatusCode, TagAssociationEntityCode
from backend.core.simple_cache import CacheKeys, cached_response
from backend.models.event import Event
from backend.models.organization import Organization
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation
from backend.utils.database import transaction_scope


@cached_response(
    cache_key=CacheKeys.EVENTS_RELATED,
    ttl=600,  # 10 minutes
    include_user=False,
    include_params=True,
)
def listing_related_events(db: Session, slug: str):
    """Get events related to the given event by slug"""

    with transaction_scope() as session:
        # First get the event by slug
        main_event = session.exec(select(Event).where(Event.slug == slug)).first()

        if not main_event:
            return []

        # Get related events by same organization, excluding the main event
        related_events = (
            session.exec(
                select(
                    Event.id,
                    Event.slug,
                    Event.name,
                    Event.start_at,
                    Event.end_at,
                    Event.cover_image_url,
                    Organization.name.label("organization_name"),
                )
                .join(Organization, Event.organization_id == Organization.id)
                .where(
                    Event.organization_id == main_event.organization_id,
                    Event.id != main_event.id,
                    Event.published_at.isnot(None),
                    Event.status == EventStatusCode.PUBLIC,
                )
                .order_by(Event.start_at)
                .limit(5)
            )
            .mappings()
            .all()
        )

        return list(related_events)
