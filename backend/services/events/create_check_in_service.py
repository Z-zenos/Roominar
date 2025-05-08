from sqlmodel import Session, select

from backend.core.constants import CheckInMethodCode, UserActionTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.check_in import CheckIn
from backend.models.event import Event
from backend.models.organization import Organization
from backend.models.transaction_item import TransactionItem
from backend.models.user_action import UserAction
from backend.schemas.check_in import CreateCheckInRequest
from backend.utils.database import save


async def create_check_in(
    db: Session,
    request: CreateCheckInRequest,
    event_id: int,
):
    check_in = (
        db.exec(
            select(
                CheckIn.id.label("check_in_id"),
                TransactionItem.user_id.label("user_id"),
                Organization.id.label("organization_id"),
            )
            .join(TransactionItem, TransactionItem.id == CheckIn.transaction_item_id)
            .join(Event, Event.id == CheckIn.event_id)
            .join(Organization, Organization.id == Event.organization_id)
            .where(CheckIn.event_id == event_id)
        )
        .mappings()
        .one_or_none()
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

        user_action = UserAction(
            user_id=check_in.user_id,
            event_id=event_id,
            organization_id=check_in.organization_id,
            action_type=UserActionTypeCode.CHECK_IN,
        )
        save(db, user_action)

        return check_in.id

    except Exception as e:
        db.rollback()
        raise e
