from datetime import datetime

from sqlmodel import Session, select

import backend.api.v1.services.auth as auth_service
from backend.core.config import settings
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.user import User
from backend.utils.database import save


async def revert_email(db: Session, token: str):
    user = db.exec(select(User).where(User.revert_email_token == token)).one_or_none()

    if not user or user.revert_email_token != token:
        raise BadRequestException(
            ErrorCode.ERR_INVALID_REVERT_EMAIL_TOKEN,
            ErrorMessage.ERR_INVALID_REVERT_EMAIL_TOKEN,
        )

    if user.revert_email_token_expire_at < datetime.now():
        raise BadRequestException(
            ErrorCode.ERR_TOKEN_EXPIRED, ErrorMessage.ERR_TOKEN_EXPIRED
        )

    try:
        user.email = user.new_email
        user.new_email = None
        user.REVERT_email_token = None
        user.REVERT_email_token_expire_at = None
        user.email_verified_at = user.email_changed_at = datetime.now()

        save(db, user)

        context = {
            "first_name": f"{user.first_name}",
            "email_changed_at": user.email_changed_at.strftime("%Y/%m/%d %H:%M"),
            "verify_change_email_url": f"{settings.APP_URL}/change-email/{token}",
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
            {settings.APP_URL}/revert-email/{user.revert_email_token}""",
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
