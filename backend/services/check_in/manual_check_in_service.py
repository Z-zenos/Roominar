from datetime import datetime

import pytz
from sqlmodel import Session, select

from backend.background_tasks.notification_tasks import push_check_in_event_notification
from backend.core.constants import CheckInMethodCode, UserActionTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.check_in import CheckIn
from backend.models.event import Event
from backend.models.organization import Organization
from backend.models.transaction_item import TransactionItem
from backend.models.user_action import UserAction
from backend.schemas.check_in import ManualCheckInRequest
from backend.utils.database import save


async def manual_check_in(
    db: Session,
    request: ManualCheckInRequest,
    event_id: int,
):
    try:
        event = db.get(Event, event_id)

        if event.start_at > datetime.now(pytz.utc):
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NOT_STARTED,
                ErrorMessage.ERR_EVENT_NOT_STARTED,
            )

        transaction_item = db.get(TransactionItem, request.transaction_item_id)

        if transaction_item.canceled_at:
            raise BadRequestException(
                ErrorCode.ERR_TICKET_CANCELED,
                ErrorMessage.ERR_TICKET_CANCELED,
            )

        if transaction_item.refunded_at:
            raise BadRequestException(
                ErrorCode.ERR_TICKET_REFUNDED,
                ErrorMessage.ERR_TICKET_REFUNDED,
            )

        check_in = (
            db.exec(
                select(
                    CheckIn.id.label("check_in_id"),
                    Organization.id.label("organization_id"),
                    Event.start_at.label("event_start_at"),
                )
                .join(Event, Event.id == CheckIn.event_id)
                .join(Organization, Organization.id == Event.organization_id)
                .where(CheckIn.transaction_item_id == request.transaction_item_id)
            )
            .mappings()
            .one_or_none()
        )

        if check_in:
            raise BadRequestException(
                ErrorCode.ERR_CHECK_IN_ALREADY_EXISTED,
                ErrorMessage.ERR_CHECK_IN_ALREADY_EXISTED,
            )

        check_in = CheckIn(
            event_id=event_id,
            ticket_id=request.ticket_id,
            application_id=request.application_id,
            transaction_item_id=request.transaction_item_id,
            checkin_method_code=CheckInMethodCode.MANUAL,
        )
        check_in = save(db, check_in)

        user_action = UserAction(
            user_id=transaction_item.user_id,
            event_id=event_id,
            organization_id=check_in.organization_id,
            action_type=UserActionTypeCode.CHECK_IN,
        )
        save(db, user_action)

        push_check_in_event_notification.delay(
            event_id=event_id,
            receiver_id=transaction_item.user_id,
            ticket_id=transaction_item.ticket_id,
        )

        return check_in.id

    except Exception as e:
        db.rollback()
        raise e
