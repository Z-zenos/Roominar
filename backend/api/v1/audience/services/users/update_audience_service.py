from sqlmodel import Session, delete, select

from backend.core.error_code import ErrorCode
from backend.core.exception import BadRequestException, UnauthorizedException
from backend.models.tag import Tag
from backend.models.user import User
from backend.models.user_tag import UserTag
from backend.schemas.user import UpdateUserRequest
from backend.utils.database import save


def update_audience(
    db: Session, current_user: User, request: UpdateUserRequest, user_id: int
) -> User:
    if current_user.id != user_id:
        raise UnauthorizedException(ErrorCode.ERR_UNAUTHORIZED)

    try:
        for attr, value in request:
            if attr != "tags" and value is not None:
                setattr(current_user, attr, value)

        db.exec(delete(UserTag).where(UserTag.user_id == current_user.id))

        if request.tags:
            tags = db.exec(select(Tag.id).where(Tag.id.in_(request.tags))).all()
            if (not tags) or (len(request.tags) != len(tags)):
                raise BadRequestException(ErrorCode.ERR_TAG_NOT_FOUND)
            user_tags = [
                UserTag(user_id=current_user.id, tag_id=tag) for tag in request.tags
            ]
            db.add_all(user_tags)

        current_user.updated_by = current_user.id
        current_user = save(db, current_user)
        return current_user

    except Exception as e:
        db.rollback()
        raise e
