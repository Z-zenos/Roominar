from sqlmodel import Session, func, select

from backend.core.constants import TagAssociationEntityCode
from backend.models.event import Event
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation


def get_event_tags(db: Session, event_ids: list[int]):
    query = (
        select(
            Event.id,
            func.json_agg(
                func.json_build_object(
                    "id", Tag.id, "image_url", Tag.image_url, "name", Tag.name
                )
            ).label("tags"),
        )
        .join(TagAssociation, TagAssociation.entity_id == Event.id)
        .join(Tag, Tag.id == TagAssociation.tag_id)
        .where(
            Event.id.in_(event_ids),
            TagAssociation.entity_code == TagAssociationEntityCode.EVENT,
        )
        .group_by(Event.id)
    )
    event_tags = db.exec(query).all()

    return event_tags
