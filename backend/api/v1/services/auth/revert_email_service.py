from datetime import datetime

from sqlmodel import Session

import backend.api.v1.services.auth as auth_service
from backend.core.config import settings
from backend.mails.mail import Email
from backend.models.user import User
from backend.utils.database import save


async def revert_email(db: Session, user: User):
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
            {settings.AUD_FRONTEND_URL}/email/revert/{user.revert_email_token}""",
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
