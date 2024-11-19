from datetime import datetime

from sqlmodel import Session, select

from backend.core.constants import EventStatusCode
from backend.core.error_code import ErrorCode
from backend.core.exception import BadRequestException
from backend.models import Event, EventTag, Tag, User
from backend.schemas.event import PublishEventRequest


async def publish_event(
    db: Session, organizer: User, request: PublishEventRequest, event_id: int
):
    try:
        event = db.get(Event, event_id)
        Event.update_by_dict(event, request.model_dump())
        print(event)
        event.organization_id = organizer.organization_id
        event.published_at = datetime.now()
        event.status = EventStatusCode.PUBLIC

        db.add(event)
        db.flush()

        if request.tags:
            request_tags = db.exec(select(Tag.id).where(Tag.id.in_(request.tags))).all()
            if (not request_tags) or (len(request.tags) != len(request_tags)):
                raise BadRequestException(ErrorCode.ERR_TAG_NOT_FOUND)
            tags = [
                EventTag(event_id=event.id, tag_id=tag_id) for tag_id in request.tags
            ]
            db.add_all(tags)

        db.flush()
        db.commit()

        return event.id

    except Exception as e:
        db.rollback()
        raise e
