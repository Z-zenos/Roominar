from datetime import datetime

from sqlmodel import Session, update

from backend.core.constants import RoleCode
from backend.core.error_code import ErrorCode
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.user import User
from backend.schemas.auth import ChangePasswordRequest
from backend.services.auth.password_service import get_password_hash, verify_password


async def change_password(
    db: Session, current_user: User, request: ChangePasswordRequest
):
    if not verify_password(request.current_password, current_user.password):
        raise BadRequestException(
            ErrorCode.ERR_INVALID_PASSWORD, "Your current password is incorrect."
        )

    try:
        now = datetime.now()
        db.exec(
            update(User)
            .where(User.id == current_user.id)
            .values(
                password=get_password_hash(request.new_password),
                password_changed_at=now,
                updated_by=current_user.id,
            )
        )

        context = {
            "first_name": f"{current_user.first_name}",
            "password_changed_at": now.strftime("%Y/%m/%d %H:%M"),
        }

        mailer = Email()
        if current_user.role_code == RoleCode.AUDIENCE:
            await mailer.send_aud_email(
                current_user.email,
                "update_password_success.html",
                "Updated password",
                context,
            )

    except Exception as e:
        db.rollback()
        raise e
