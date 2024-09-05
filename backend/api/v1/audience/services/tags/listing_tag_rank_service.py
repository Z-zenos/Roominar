from sqlmodel import Session, desc, func, select

from backend.models.event_tag import EventTag
from backend.models.tag import Tag
from backend.models.user_tag import UserTag


def listing_tag_rank(db: Session):
    UsedTag = select(EventTag.tag_id).union_all(select(UserTag.tag_id))
    tags = (
        db.exec(
            select(Tag.id, Tag.name, Tag.image_url)
            .select_from(UsedTag)
            .join(Tag, Tag.id == UsedTag.c.tag_id)
            .group_by(Tag.id)
            .order_by(desc(func.count(Tag.id)))
            .limit(5)
        )
        .mappings()
        .all()
    )

    return tags
