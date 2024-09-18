from datetime import datetime

from sqlmodel import Session

from backend.api.v1.services.auth.password_service import get_password_hash
from backend.core.constants import RoleCode
from backend.mails.mail import Email
from backend.models.user import User
from backend.schemas.auth import ResetPasswordRequest
from backend.utils.database import save


async def reset_password(db: Session, user: User, request: ResetPasswordRequest):
    try:
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
