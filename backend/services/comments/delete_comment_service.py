from datetime import datetime, timedelta

from sqlmodel import Session, update

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.comment import Comment


async def delete_comment(
    db: Session,
    comment: Comment,
):
    if comment.created_at < datetime.now() - timedelta(days=7):
        raise BadRequestException(
            ErrorCode.ERR_CANT_DELETE_COMMENT, ErrorMessage.ERR_CANT_DELETE_COMMENT
        )

    db.exec(update(Comment).where(Comment.id == comment.id).values(deleted_at=True))
    db.commit()
