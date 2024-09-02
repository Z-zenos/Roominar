from datetime import datetime

import pytz
from sqlmodel import Session, select

from backend.core.config import settings
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.tag import Tag
from backend.models.user import User
from backend.models.user_tag import UserTag
from backend.schemas.user import VerifyAudienceRequest
from backend.utils.database import save


async def verify_audience(
    db: Session,
    request: VerifyAudienceRequest,
    token: str,
) -> User:
    user = db.exec(select(User).where(User.email_verify_token == token)).first()
    if not user:
        raise BadRequestException(
            error_code=ErrorCode.ERR_INVALID_TOKEN,
            message=ErrorMessage.ERR_INVALID_TOKEN,
        )

    if user and user.email_verify_at:
        raise BadRequestException(
            error_code=ErrorCode.ERR_USER_ALREADY_EXISTED,
            message=ErrorMessage.ERR_USER_ALREADY_EXISTED,
        )

    if user and user.email_verify_token_expire_at < datetime.now(pytz.utc):
        raise BadRequestException(
            error_code=ErrorCode.ERR_TOKEN_EXPIRED,
            message=ErrorMessage.ERR_TOKEN_EXPIRED,
        )

    user.industry_code = request.industry_code
    user.job_type_code = request.job_type_code
    if request.tags:
        request_tags = db.exec(select(Tag.id).where(Tag.id.in_(request.tags))).all()
        if (not request_tags) or (len(request.tags) != len(request_tags)):
            raise BadRequestException(
                ErrorCode.ERR_TAG_NOT_FOUND, ErrorMessage.ERR_TAG_NOT_FOUND
            )
        user_tags = [UserTag(user_id=user.id, tag_id=tag) for tag in request.tags]
        db.add_all(user_tags)

    user.email_verify_at = datetime.now()
    user.email_verify_token = None
    user.email_verify_token_expire_at = None
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
    return user.id
