from datetime import datetime

import pytz
from sqlmodel import Session

import backend.api.v1.audience.services.auth as auth_service
from backend.api.v1.audience.services.auth.auth_service import get_user_by_email
from backend.core.config import settings
from backend.core.error_code import ErrorCode
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.user import RoleCode, User
from backend.schemas.user import RegisterAudienceRequest
from backend.utils.database import save


async def register_audience(db: Session, request: RegisterAudienceRequest) -> User:
    email = request.email
    user = get_user_by_email(db, email, RoleCode.AUDIENCE)

    if user and user.email_verify_at:
        raise BadRequestException(ErrorCode.ERR_USER_ALREADY_EXISTED)

    if user and user.email_verify_token_expire_at > datetime.now(pytz.utc):
        context = {
            "url": f"""{settings.AUD_FRONTEND_URL}/register?token={
                user.email_verify_token
            }""",
            "expire_at": user.email_verify_token_expire_at.strftime("%Y/%m/%d %H:%M"),
            "first_name": user.first_name,
        }

        mailer = Email()
        await mailer.send_aud_email(
            email,
            "register_audience.html",
            "Road to success",
            context,
        )

        return user

    token, expire = auth_service.create_email_verification_token()

    # update user if existed
    if user:
        user.email_verify_token = token
        user.email_verify_token_expire_at = expire
        new_user = save(db, user)
    else:
        new_user = User(
            email=email,
            email_verify_token=token,
            email_verify_token_expire_at=expire,
            role_code=RoleCode.AUDIENCE,
            password=auth_service.get_password_hash(request.password),
            first_name=request.first_name,
            last_name=request.last_name,
        )
        new_user = save(db, new_user)

    context = {
        "url": f"""{settings.AUD_FRONTEND_URL}/register?token={
            new_user.email_verify_token
        }""",
        "expire_at": expire.strftime("%Y/%m/%d %H:%M"),
        "first_name": new_user.first_name,
    }

    mailer = Email()
    await mailer.send_aud_email(
        email,
        "register_audience.html",
        "Account verification",
        context,
    )

    return new_user


# async def verify_register_audience(
#     db: Session,
#     token: str,
# ) -> User:
#     check_valid_token(token, db)

#     user = db.exec(select(User).where(User.email_verify_token == token)).first()

#     update_user(user, **kwargs)
#     user.role_code = RoleCode.AUDIENCE
#     user.created_at = datetime.now()
#     user.updated_at = datetime.now()
#     user.email_verify_at = datetime.now()
#     user.password = auth_service.get_password_hash(kwargs.get("password"))
#     user.email_verify_token = None
#     user.email_verify_token_expire_at = None
#     new_user = save(db, user)

#     # TODO: Get events replaced for context
#     context = {
#         "username": user.first_name_kanji + user.last_name_kanji,
#         "search_page_url": f"{settings.FRONTEND_AUD_URL}/search",
#     }

#     mailer = Email()
#     mailer.send_email(
#         new_user.email,
#         "register_second_step.html",
#         "【ehaco!（エハコ）】本登録完了のお知らせ",
#         context,
#     )
#     return new_user
