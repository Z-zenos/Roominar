from datetime import datetime

from fastapi import BackgroundTasks
from sqlmodel import Session, select

from backend.core.config import settings
from backend.core.constants import TagAssociationEntityCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation
from backend.models.user import User
from backend.schemas.auth import VerifyAudienceRequest
from backend.utils.database import save


async def verify_audience(
    db: Session,
    worker: BackgroundTasks,
    user: User,
    request: VerifyAudienceRequest,
) -> User:
    if user and user.email_verified_at:
        raise BadRequestException(
            error_code=ErrorCode.ERR_USER_ALREADY_EXISTED,
            message=ErrorMessage.ERR_USER_ALREADY_EXISTED,
        )

    user.industry_code = request.industry_code
    user.job_type_code = request.job_type_code

    try:
        if request.tags:
            request_tags = db.exec(select(Tag.id).where(Tag.id.in_(request.tags))).all()
            if (not request_tags) or (len(request.tags) != len(request_tags)):
                raise BadRequestException(
                    ErrorCode.ERR_TAG_NOT_FOUND, ErrorMessage.ERR_TAG_NOT_FOUND
                )
            user_tags = [
                TagAssociation(
                    entity_id=user.id,
                    tag_id=tag,
                    entity_code=TagAssociationEntityCode.USER,
                )
                for tag in request.tags
            ]
            db.add_all(user_tags)

        user.email_verified_at = datetime.now()
        user.verify_email_token = None
        user.verify_email_token_expire_at = None
        user = save(db, user)

        context = {
            "first_name": user.first_name,
            "search_page_url": f"{settings.AUD_FRONTEND_URL}/search",
            "my_profile_page_url": f"{settings.AUD_FRONTEND_URL}/profiles",
        }

        mailer = Email()
        worker.add_task(
            mailer.send_aud_email,
            user.email,
            "create_audience_account_success.html",
            "Thankyu",
            context,
        )
        return user.id

    except Exception as e:
        db.rollback()
        raise e
