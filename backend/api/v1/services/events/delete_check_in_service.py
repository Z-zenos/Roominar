from sqlmodel import Session, select

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.check_in import CheckIn
from backend.models.event import Event
from backend.models.user import User


async def delete_check_in(db: Session, user: User, event_id: int, check_in_id: int):
    check_in = db.exec(
        select(CheckIn)
        .join(Event, CheckIn.event_id == Event.id)
        .where(
            CheckIn.id == check_in_id,
            CheckIn.event_id == event_id,
            Event.organization_id == user.organization_id,
        )
    ).one_or_none()

    if not check_in:
        raise BadRequestException(
            ErrorCode.ERR_CHECK_IN_NOT_FOUND, ErrorMessage.ERR_CHECK_IN_NOT_FOUND
        )

    try:
        db.delete(check_in)
        db.commit()

    except Exception as e:
        db.rollback()
        raise e
