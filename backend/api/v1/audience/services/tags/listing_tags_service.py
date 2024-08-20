from sqlmodel import Session, select

from backend.models.tag import Tag
from backend.models.tag_group import TagGroup
from backend.schemas.tag import TagItem


def listing_tags(db: Session):
    tag_groups = db.exec(select(TagGroup.id, TagGroup.name)).all()
    result = {
        group.id: {"group_id": group.id, "group_name": group.name, "tags": []}
        for group in tag_groups
    }

    tags = db.exec(select(Tag.id, Tag.name, Tag.image_url, Tag.tag_group_id)).all()

    for tag in tags:
        result[tag.tag_group_id]["tags"].append(
            TagItem(
                id=tag.id,
                name=tag.name,
                image_url=tag.image_url,
            )
        )

    return list(result.values())
