from datetime import datetime, timedelta

from sqlmodel import Session

import backend.api.v1.services.auth as auth_service
from backend.core.config import settings
from backend.core.constants import LoginMethodCode, RoleCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.user import User
from backend.schemas.auth import SocialAuthRequest, TokenResponse
from backend.utils.database import save


async def social_auth(db: Session, request: SocialAuthRequest):
    if not request.is_verified:
        raise BadRequestException(
            ErrorCode.ERR_GOOGLE_ACCOUNT_NOT_VERIFIED,
            ErrorMessage.ERR_GOOGLE_ACCOUNT_NOT_VERIFIED,
        )

    user = auth_service.get_user_by_email(db, request.email, RoleCode.AUDIENCE)

    if user and not user.email_verified_at:
        raise BadRequestException(
            ErrorCode.ERR_USER_NOT_VERIFIED, ErrorMessage.ERR_USER_NOT_VERIFIED
        )

    if not user:
        user = User(
            email=request.email,
            email_verified_at=datetime.now(),
            role_code=RoleCode.AUDIENCE,
            first_name=request.family_name if request.family_name else request.name,
            last_name=request.given_name,
            avatar_url=request.picture,
            email_verify_token=None,
            email_verify_token_expire_at=None,
            login_method_code=LoginMethodCode.GOOGLE,
        )
        user = save(db, user)

        context = {
            "first_name": user.first_name,
            "search_page_url": f"{settings.AUD_FRONTEND_URL}/search",
            "my_profile_page_url": f"{settings.AUD_FRONTEND_URL}/profiles",
        }

        mailer = Email()
        await mailer.send_aud_email(
            user.email,
            "create_audience_account_success.html",
            "Thankyu",
            context,
        )

    access_token_expires = datetime.now() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    access_token = auth_service.create_access_token(
        data={"sub": user.email, "role": user.role_code}, expire=access_token_expires
    )
    refresh_token, refresh_expire_at = auth_service.create_refresh_token(
        {"sub": user.email, "role": user.role_code}, remember_me=True
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expire_at=access_token_expires,
        refresh_token=refresh_token,
        refresh_expire_at=refresh_expire_at,
    )
