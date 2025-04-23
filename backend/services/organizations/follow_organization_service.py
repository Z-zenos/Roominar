from sqlmodel import Session, exists

from backend.core.constants import FollowEntityCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models import User
from backend.models.follow import Follow


async def follow_organization(db: Session, current_user: User, organization_id: int):
    follow = db.scalar(
        exists()
        .where(
            Follow.follower_id == current_user.id,
            Follow.following_id == organization_id,
        )
        .select()
    )

    if follow:
        raise BadRequestException(
            ErrorCode.ERR_ORGANIZATION_FOLLOW_EXISTED,
            ErrorMessage.ERR_ORGANIZATION_FOLLOW_EXISTED,
        )

    try:
        follow = Follow(
            follower_id=current_user.id,
            following_id=organization_id,
            entity_code=FollowEntityCode.ORGANIZATION,
        )
        db.add(follow)
        db.commit()

        return follow.id

    except Exception as e:
        db.rollback()
        raise e
