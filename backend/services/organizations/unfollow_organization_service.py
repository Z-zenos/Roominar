from sqlmodel import Session, select

from backend.core.constants import UserActionTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models import User
from backend.models.follow import Follow
from backend.models.user_action import UserAction


async def unfollow_organization(db: Session, current_user: User, organization_id: int):
    follow = db.exec(
        select(Follow).where(
            Follow.follower_id == current_user.id,
            Follow.following_id == organization_id,
        )
    ).one_or_none()

    if not follow:
        raise BadRequestException(
            ErrorCode.ERR_ORGANIZATION_FOLLOW_NOT_FOUND,
            ErrorMessage.ERR_ORGANIZATION_FOLLOW_NOT_FOUND,
        )

    try:
        db.delete(follow)
        db.add(
            UserAction(
                user_id=current_user.id,
                organization_id=organization_id,
                action_type=UserActionTypeCode.UNFOLLOW,
            )
        )
        db.commit()

    except Exception as e:
        db.rollback()
        raise e
