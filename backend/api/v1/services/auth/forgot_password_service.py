from sqlmodel import Session

import backend.api.v1.services.auth as auth_service
from backend.core.config import settings
from backend.core.constants import LoginMethodCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.user import RoleCode
from backend.schemas.auth import ForgotPasswordRequest


async def forgot_password(db: Session, request: ForgotPasswordRequest):
    # Get user based on POSTed email
    user = auth_service.get_user_by_email(db, request.email, request.role_code)

    if not user:
        raise BadRequestException(
            ErrorCode.ERR_INVALID_EMAIL, ErrorMessage.ERR_INVALID_EMAIL
        )

    if (
        user
        and user.role_code == RoleCode.AUDIENCE
        and user.login_method_code == LoginMethodCode.GOOGLE
    ):
        raise BadRequestException(
            ErrorCode.ERR_LOGGED_IN_BY_GOOGLE,
            ErrorMessage.ERR_LOGGED_IN_BY_GOOGLE,
        )

    # Create new email reset password token
    (
        reset_token,
        encrypted_token,
        expire_at,
    ) = auth_service.gen_encrypted_token(
        settings.RESET_PASSWORD_TOKEN_EXPIRE_MINUTES,
        settings.RESET_PASSWORD_TOKEN_LENGTH,
    )
    try:
        # Update user reset password token and expire_at
        user.reset_password_token = encrypted_token
        user.reset_password_token_expire_at = expire_at
        db.commit()

        context = {
            "expire_at": user.reset_password_token_expire_at.strftime("%Y/%m/%d %H:%M"),
            "first_name": f"{user.first_name}",
            "url": f"{settings.AUD_FRONTEND_URL}/reset-password/{reset_token}",
        }

        mailer = Email()
        if user.role_code == RoleCode.ORGANIZER:
            await mailer.send_aud_email(
                request.email,
                "require_reset_organization_password.html",
                "Reset password",
                context,
            )
        else:
            await mailer.send_aud_email(
                request.email,
                "require_reset_audience_password.html",
                "Reset password",
                context,
            )

        return user

    except Exception as e:
        db.rollback()
        raise e
