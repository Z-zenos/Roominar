from sqlmodel import Session, select, func

from backend.models.event import Event
from backend.models.event_tag import EventTag
from backend.models.tag import Tag


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
        .join(EventTag, EventTag.event_id == Event.id)
        .join(Tag, Tag.id == EventTag.tag_id)
        .where(Event.id.in_(event_ids))
        .group_by(Event.id)
    )
    event_tags = db.exec(query).all()

    return event_tags
