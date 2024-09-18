from datetime import datetime

import pytz
from sqlmodel import Session, select

import backend.api.v1.services.auth as auth_service
from backend.core.config import settings
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.user import RoleCode, User
from backend.schemas.auth import ChangeEmailRequest
from backend.utils.database import save


async def request_change_email(
    db: Session, current_user: User, request: ChangeEmailRequest
):
    email = request.new_email
    is_user_existed = auth_service.get_user_by_email(db, email, RoleCode.AUDIENCE)

    if is_user_existed:
        raise BadRequestException(
            ErrorCode.ERR_EMAIL_ALREADY_EXISTED, ErrorMessage.ERR_EMAIL_ALREADY_EXISTED
        )

    if current_user.email == email:
        raise BadRequestException(
            ErrorCode.ERR_INVALID_EMAIL, ErrorMessage.ERR_INVALID_EMAIL
        )

    if not auth_service.verify_password(request.password, current_user.password):
        raise BadRequestException(
            ErrorCode.ERR_INVALID_PASSWORD, ErrorMessage.ERR_INVALID_PASSWORD
        )

    verify_token, verify_expire = auth_service.create_verify_change_email_token()
    revert_token, revert_expire = auth_service.create_revert_email_token()
    try:
        current_user.old_email = current_user.email
        current_user.new_email = email
        current_user.verify_change_email_token = verify_token
        current_user.verify_change_email_token_expire_at = verify_expire
        current_user.revert_email_token = revert_token
        current_user.revert_email_token_expire_at = revert_expire

        save(db, current_user)

        request_context = {
            "first_name": f"{current_user.first_name}",
            "email_changed_at": datetime.now().strftime("%Y/%m/%d %H:%M"),
            "verify_change_email_url": f"""
            {settings.APP_URL}/api/v1/auth/change-email/{verify_token}""",
            "expire_at": current_user.verify_change_email_token_expire_at.strftime(
                "%Y/%m/%d %H:%M"
            ),
        }

        mailer = Email()
        await mailer.send_aud_email(
            current_user.new_email,
            "request_change_email.html",
            "Confirm Your Email Change Request",
            request_context,
        )

        alert_context = {
            "email_changed_at": datetime.now().strftime("%Y/%m/%d %H:%M"),
            "revert_email_url": f"""
                {settings.APP_URL}/api/v1/auth/revert-email/{revert_token}
            """,
            "expire_at": current_user.revert_email_token_expire_at.strftime(
                "%Y/%m/%d %H:%M"
            ),
        }

        await mailer.send_aud_email(
            current_user.old_email,
            "alert_change_email.html",
            "Alert Change Email",
            alert_context,
        )

        return current_user
    except Exception as e:
        db.rollback()
        raise e


async def verify_new_email(db: Session, token: str):
    user = db.exec(
        select(User).where(User.verify_change_email_token == token)
    ).one_or_none()

    if not user or user.verify_change_email_token != token:
        raise BadRequestException(
            ErrorCode.ERR_INVALID_VERIFY_CHANGE_EMAIL_TOKEN,
            ErrorMessage.ERR_INVALID_VERIFY_CHANGE_EMAIL_TOKEN,
        )

    if user.verify_change_email_token_expire_at < datetime.now(pytz.utc):
        raise BadRequestException(
            ErrorCode.ERR_TOKEN_EXPIRED, ErrorMessage.ERR_TOKEN_EXPIRED
        )

    try:
        user.email = user.new_email
        user.new_email = None
        user.verify_change_email_token = None
        user.verify_change_email_token_expire_at = None
        user.email_verified_at = user.email_changed_at = datetime.now()

        save(db, user)

        context = {
            "first_name": f"{user.first_name}",
            "email_changed_at": user.email_changed_at.strftime("%Y/%m/%d %H:%M"),
        }

        mailer = Email()
        await mailer.send_aud_email(
            user.email,
            "change_email_success.html",
            "Change email success",
            context,
        )

        alert_context = {
            "email_changed_at": user.email_changed_at.strftime("%Y/%m/%d %H:%M"),
            "revert_email_url": f"""
            {settings.APP_URL}/api/v1/auth/revert-email/{user.revert_email_token}""",
            "expire_at": user.revert_email_token_expire_at.strftime("%Y/%m/%d %H:%M"),
        }

        await mailer.send_aud_email(
            user.old_email,
            "alert_change_email.html",
            "Alert Change Email",
            alert_context,
        )

        return auth_service.gen_auth_token(user)

    except Exception as e:
        db.rollback()
        raise e
