from sqlmodel import Session, select

from backend.models.tag import Tag
from backend.models.user_tag import UserTag


async def get_user_tags(db: Session, user_id: int):
    tags = (
        db.exec(
            select(Tag.id, Tag.name)
            .join(UserTag, UserTag.tag_id == Tag.id)
            .where(UserTag.user_id == user_id)
        )
        .mappings()
        .all()
    )
    return tags
