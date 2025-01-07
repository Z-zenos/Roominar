from sqlmodel import Session, exists

from backend.core.constants import CheckInMethodCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.check_in import CheckIn
from backend.schemas.check_in import CreateCheckInRequest


async def create_check_in(
    db: Session,
    request: CreateCheckInRequest,
    event_id: int,
):
    check_in = db.scalar(
        exists()
        .where(
            CheckIn.event_id == event_id,
            CheckIn.application_id == request.application_id,
        )
        .select()
    )

    if check_in:
        raise BadRequestException(
            ErrorCode.ERR_CHECK_IN_ALREADY_EXISTED,
            ErrorMessage.ERR_CHECK_IN_ALREADY_EXISTED,
        )

    try:
        check_in = CheckIn(
            event_id=event_id,
            ticket_id=request.ticket_id,
            application_id=request.application_id,
            transaction_item_id=request.transaction_item_id,
            checkin_method_code=CheckInMethodCode.MANUAL,
        )
        db.add(check_in)
        db.commit()

        return check_in.id

    except Exception as e:
        print(e)
        db.rollback()
        raise e
