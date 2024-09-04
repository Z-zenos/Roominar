from sqlmodel import Session, select, update

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.event import Event


def count_view(db: Session, slug: str):
    try:
        event = db.exec(select(Event).where(Event.slug == slug)).one_or_none()

        if not event:
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NOT_FOUND, ErrorMessage.ERR_EVENT_NOT_FOUND
            )

        db.exec(
            update(Event)
            .where(Event.slug == slug)
            .values(view_number=Event.view_number + 1)
        )

        db.commit()
        return event.view_number + 1

    except Exception as e:
        db.rollback()
        raise e
