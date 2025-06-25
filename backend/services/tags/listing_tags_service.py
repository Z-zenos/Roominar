from sqlmodel import Session, select

from backend.core.simple_cache import CacheKeys, cached_response
from backend.models.tag import Tag
from backend.models.tag_group import TagGroup
from backend.schemas.tag import TagItem
from backend.utils.database import transaction_scope


@cached_response(
    cache_key=CacheKeys.TAGS_LIST,
    ttl=1800,  # 30 minutes for relatively static tag data
    include_params=False,
)
def listing_tags(db: Session):
    """List all tags grouped by tag groups with caching"""

    with transaction_scope() as session:
        # Get all tag groups
        tag_groups = session.exec(select(TagGroup.id, TagGroup.name)).all()

        # Initialize result structure
        result = {
            group.id: {"group_id": group.id, "group_name": group.name, "tags": []}
            for group in tag_groups
        }

        # Get all tags
        tags = session.exec(
            select(Tag.id, Tag.name, Tag.image_url, Tag.tag_group_id).order_by(
                Tag.id.desc()
            )
        ).all()

        # Group tags by tag group
        for tag in tags:
            if tag.tag_group_id in result:
                result[tag.tag_group_id]["tags"].append(
                    TagItem(
                        id=tag.id,
                        name=tag.name,
                        image_url=tag.image_url,
                    )
                )

        return list(result.values())
