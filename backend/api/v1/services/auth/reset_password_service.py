import hashlib
from datetime import datetime

from sqlmodel import Session, select

from backend.api.v1.services.auth.password_service import get_password_hash
from backend.core.constants import RoleCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.user import User
from backend.schemas.auth import ResetPasswordRequest
from backend.utils.database import save


async def reset_password(db: Session, request: ResetPasswordRequest, reset_token: str):
    """
    Verify user based on reset token and reset user password
    """
    # Get encrypted token based on the reset token sent in email
    hashed_token = hashlib.sha256(reset_token.encode("utf-8")).hexdigest()
    # Find user based on reset token.
    user = db.scalar(
        select(User).where(
            User.reset_password_token == hashed_token,
            User.reset_password_token_expire_at > datetime.now(),
        )
    )

    if not user:
        raise BadRequestException(
            ErrorCode.ERR_INVALID_RESET_PASSWORD_TOKEN,
            ErrorMessage.ERR_INVALID_RESET_PASSWORD_TOKEN,
        )

    try:
        # Update user
        user.reset_password_token = user.reset_password_token_expire_at = None
        user.password = get_password_hash(request.new_password)
        user.password_changed_at = datetime.now()
        user.updated_by = user.id

        user = save(db, user)

        context = {"first_name": f"{user.first_name}", "email": user.email}

        mailer = Email()
        if user.role_code == RoleCode.AUDIENCE:
            await mailer.send_aud_email(
                user.email,
                "reset_audience_password_success.html",
                "Reset password success",
                context,
            )

        return user

    except Exception as e:
        db.rollback()
        raise e
