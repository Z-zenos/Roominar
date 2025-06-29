from fastapi import Depends
from sqlmodel import Session, select

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.db.database import get_read_db
from backend.dependencies.authentication import get_current_user
from backend.models.comment import Comment
from backend.models.user import User


async def get_comment(
    db: Session = Depends(get_read_db),
    user: User = Depends(get_current_user),
    comment_id: int = None,
) -> Comment:
    comment = db.exec(
        select(Comment).where(Comment.id == comment_id, Comment.user_id == user.id)
    ).one_or_none()

    if not comment:
        raise BadRequestException(
            ErrorCode.ERR_COMMENT_NOT_FOUND,
            ErrorMessage.ERR_COMMENT_NOT_FOUND,
        )
    return comment
