from sqlmodel import Session, select

from backend.core.constants import TagAssociationEntityCode
from backend.core.simple_cache import CacheKeys, cached_response
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation
from backend.utils.database import transaction_scope


@cached_response(
    cache_key=CacheKeys.TAGS_EVENT,
    ttl=600,  # 10 minutes for event tags
    include_params=True,
)
def get_event_tags(db: Session, event_id: int):
    """Get tags associated with an event with caching"""

    with transaction_scope() as session:
        event_tags = session.exec(
            select(
                Tag.id,
                Tag.image_url,
                Tag.name,
            )
            .join(TagAssociation, Tag.id == TagAssociation.tag_id)
            .where(
                TagAssociation.entity_id == event_id,
                TagAssociation.entity_code == TagAssociationEntityCode.EVENT,
            )
        ).all()

        return list(event_tags)
