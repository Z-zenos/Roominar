from sqlmodel import Session, select

from backend.background_tasks.notification_tasks import push_check_in_event_notification
from backend.core.constants import CheckInMethodCode, UserActionTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.core.security import verify_qr_checksum
from backend.models.check_in import CheckIn
from backend.models.event import Event
from backend.models.organization import Organization
from backend.models.transaction_item import TransactionItem
from backend.models.user import User
from backend.models.user_action import UserAction
from backend.schemas.check_in import QRCheckInRequest
from backend.utils.database import save


async def qr_check_in(
    db: Session,
    organizer: User,
    request: QRCheckInRequest,
    event_id: int,
) -> CheckIn:
    try:
        # 1. Xác thực checksum
        if not verify_qr_checksum(
            request.qr_code_id, request.user_id, request.event_id, request.checksum
        ):
            raise BadRequestException(
                ErrorCode.ERR_INVALID_CHECK_IN_QR_CODE,
                ErrorMessage.ERR_INVALID_CHECK_IN_QR_CODE,
            )

        # 2. Tìm TransactionItem hợp lệ
        statement = select(TransactionItem).where(
            TransactionItem.qr_code_id == request.qr_code_id,
            TransactionItem.user_id == request.user_id,
        )

        result = db.exec(statement)
        item = result.first()

        if not item:
            raise BadRequestException(
                ErrorCode.ERR_INVALID_QR_CODE_WITH_USER,
                ErrorMessage.ERR_INVALID_QR_CODE_WITH_USER,
            )

        if item.canceled_at:
            raise BadRequestException(
                ErrorCode.ERR_TICKET_CANCELED,
                ErrorMessage.ERR_TICKET_CANCELED,
            )

        if item.refunded_at:
            raise BadRequestException(
                ErrorCode.ERR_TICKET_REFUNDED,
                ErrorMessage.ERR_TICKET_REFUNDED,
            )

        check_in = (
            db.exec(
                select(
                    CheckIn.id.label("check_in_id"),
                    Organization.id.label("organization_id"),
                )
                .join(Event, Event.id == CheckIn.event_id)
                .join(Organization, Organization.id == Event.organization_id)
                .where(CheckIn.transaction_item_id == item.id)
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
            ticket_id=item.ticket_id,
            transaction_item_id=item.id,
            checkin_method_code=CheckInMethodCode.QR,
        )
        check_in = save(db, check_in)

        user_action = UserAction(
            user_id=item.user_id,
            event_id=event_id,
            organization_id=organizer.organization_id,
            action_type=UserActionTypeCode.CHECK_IN,
        )
        save(db, user_action)

        push_check_in_event_notification.delay(
            event_id=event_id,
            receiver_id=item.user_id,
            ticket_id=item.ticket_id,
        )

        return check_in.id

    except Exception as e:
        db.rollback()
        raise e
