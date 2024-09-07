from sqlmodel import Session

import backend.api.v1.services.auth as auth_service
from backend.core.config import settings
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.user import RoleCode
from backend.schemas.user import ForgotPasswordRequest


async def forgot_password(db: Session, request: ForgotPasswordRequest):
    # Get user based on POSTed email
    user = auth_service.get_user_by_email(db, request.email, request.role_code)

    # Verify user if exist
    if not user:
        raise BadRequestException(
            ErrorCode.ERR_USER_NOT_FOUND, ErrorMessage.ERR_USER_NOT_FOUND
        )

    if not user.email_verify_at:
        raise BadRequestException(
            ErrorCode.ERR_USER_NOT_VERIFIED,
            ErrorMessage.ERR_USER_NOT_VERIFIED,
        )

    if user and user.email and not user.password:
        raise BadRequestException(
            ErrorCode.ERR_LOGGED_IN_BY_GOOGLE,
            ErrorMessage.ERR_LOGGED_IN_BY_GOOGLE,
        )

    # Create new email reset password token
    (
        reset_token,
        encrypted_token,
        expire_at,
    ) = auth_service.create_reset_password_token()
    try:
        # Update user reset password token and expire_at
        user.reset_password_token = encrypted_token
        user.reset_password_token_expire_at = expire_at
        db.commit()

        context = {
            "expire_at": user.reset_password_token_expire_at.strftime("%Y/%m/%d %H:%M"),
            "name": f"{user.first_name}",
            "url": f"{settings.AUD_FRONTEND_URL}/reset-password/{reset_token}",
        }

        mailer = Email()
        if user.role_code == RoleCode.ORGANIZER:
            mailer.send_organization_email(
                request.email,
                "organization_reset_password.html",
                "Reset password",
                context,
            )
        else:
            mailer.send_email(
                request.email,
                "reset_audience_password.html",
                "Reset password",
                context,
            )

        return user

    except Exception as e:
        db.rollback()
        raise e
