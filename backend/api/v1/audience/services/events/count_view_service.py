from sqlmodel import Session, select

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.event import Event
from backend.utils.database import save


def count_view(db: Session, slug: str):
    try:
        event = db.exec(select(Event).where(Event.slug == slug)).one_or_none()

        if not event:
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NOT_FOUND, ErrorMessage.ERR_EVENT_NOT_FOUND
            )
        event.view_number += 1
        save(db, event)
        return event.view_number

    except Exception as e:
        db.rollback()
        raise e
