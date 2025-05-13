from datetime import datetime

import pytz
from fastapi import BackgroundTasks
from sqlmodel import Session, select

import backend.services.auth as auth_service
from backend.core.config import settings
from backend.core.constants import LoginMethodCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.user import RoleCode, User
from backend.schemas.auth import RegisterAudienceRequest
from backend.services.auth.token_service import gen_encrypted_token
from backend.utils.database import save


async def register_audience(
    db: Session, worker: BackgroundTasks, request: RegisterAudienceRequest
) -> User:
    email = request.email
    user = db.exec(
        select(User).where(User.email == email, User.role_code == RoleCode.AUDIENCE)
    ).one_or_none()

    if user and user.email_verified_at:
        raise BadRequestException(
            ErrorCode.ERR_USER_ALREADY_EXISTED, ErrorMessage.ERR_USER_ALREADY_EXISTED
        )

    verify_token, encrypted_verify_token, verify_expire_at = gen_encrypted_token(
        settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES,
        settings.EMAIL_VERIFICATION_TOKEN_LENGTH,
    )

    try:
        if user and user.verify_email_token_expire_at > datetime.now(pytz.utc):
            print(user, encrypted_verify_token)
            user.verify_email_token = encrypted_verify_token
            user.verify_email_token_expire_at = verify_expire_at
            new_user = save(db, user)

            context = {
                "url": f"""
                    {settings.WEB_URL}/email/verify/{user.verify_email_token}
                """,
                "expire_at": user.verify_email_token_expire_at.strftime(
                    "%Y/%m/%d %H:%M"
                ),
                "first_name": user.first_name,
            }

            mailer = Email()
            worker.add_task(
                mailer.send_aud_email,
                email,
                "register_audience.html",
                "Account Verification",
                context,
            )

            return user

        new_user = User(
            email=email,
            verify_email_token=encrypted_verify_token,
            verify_email_token_expire_at=verify_expire_at,
            role_code=RoleCode.AUDIENCE,
            password=auth_service.get_password_hash(request.password),
            first_name=request.first_name,
            last_name=request.last_name,
            login_method_code=LoginMethodCode.NORMAL,
        )
        new_user = save(db, new_user)

        context = {
            "url": f"{settings.WEB_URL}/email/verify/{verify_token}",
            "expire_at": verify_expire_at.strftime("%Y/%m/%d %H:%M"),
            "first_name": new_user.first_name,
        }

        mailer = Email()
        worker.add_task(
            mailer.send_aud_email,
            email,
            "register_audience.html",
            "Account Verification",
            context,
        )

        return new_user

    except Exception as e:
        db.rollback()
        raise e
