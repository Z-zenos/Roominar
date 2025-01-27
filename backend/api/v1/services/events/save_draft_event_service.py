from datetime import datetime

from sqlmodel import Session, select

from backend.core.constants import EventStatusCode, TagAssociationEntityCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models import Event, Tag, User
from backend.models.tag_association import TagAssociation
from backend.schemas.event import SaveDraftEventRequest
from backend.utils.database import fetch_one, save


async def save_draft_event(
    db: Session, organizer: User, request: SaveDraftEventRequest, event_id: int
):
    try:
        event = fetch_one(
            db,
            select(Event).where(
                Event.id == event_id, Event.organization_id == organizer.organization_id
            ),
        )

        if not event:
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NOT_FOUND, ErrorMessage.ERR_EVENT_NOT_FOUND
            )

        Event.update_by_dict(event, request.model_dump())
        event.organization_id = organizer.organization_id
        event.updated_at = datetime.now()
        event.updated_by = organizer.id
        event.status = EventStatusCode.DRAFT
        event.name = (
            request.name
            if request.name
            else f"Draft Event {datetime.now().strftime('%Y/%m/%d %H:%M')}"
        )

        if request.tags:
            request_tags = db.exec(select(Tag.id).where(Tag.id.in_(request.tags))).all()
            if (not request_tags) or (len(request.tags) != len(request_tags)):
                raise BadRequestException(ErrorCode.ERR_TAG_NOT_FOUND)
            tags = [
                TagAssociation(
                    entity_id=event.id,
                    tag_id=tag_id,
                    entity_code=TagAssociationEntityCode.EVENT,
                )
                for tag_id in request.tags
            ]
            db.add_all(tags)

        db.flush()
        save(db, event)

        return event.id

    except Exception as e:
        db.rollback()
        raise e
