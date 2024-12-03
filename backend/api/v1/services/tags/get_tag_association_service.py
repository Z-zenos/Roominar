from sqlmodel import Session, select

from backend.core.constants import TagAssociationEntityCode
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation


def get_tag_association(
    db: Session, entity_id: int, entity_code: TagAssociationEntityCode
):
    tags = (
        db.exec(
            select(Tag.id, Tag.name, Tag.image_url)
            .join(TagAssociation, TagAssociation.tag_id == Tag.id)
            .where(
                TagAssociation.entity_id == entity_id,
                TagAssociation.entity_code == entity_code,
            )
        )
        .mappings()
        .all()
    )
    return tags
