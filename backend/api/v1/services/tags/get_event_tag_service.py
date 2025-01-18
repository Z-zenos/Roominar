from sqlmodel import Session, select

from backend.core.constants import TagAssociationEntityCode
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation


def get_event_tags(db: Session, event_id: int):
    event_tags = db.exec(
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

    return event_tags
