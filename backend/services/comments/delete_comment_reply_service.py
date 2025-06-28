from datetime import datetime, timedelta

from sqlmodel import Session, select, update

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.comment_reply import CommentReply


async def delete_comment_reply(
    db: Session,
    reply_id: int,
):
    reply = db.exec(
        select(CommentReply).where(CommentReply.id == reply_id)
    ).one_or_none()

    if not reply:
        raise BadRequestException(
            ErrorCode.ERR_COMMENT_NOT_FOUND, ErrorMessage.ERR_COMMENT_NOT_FOUND
        )

    if reply.created_at < datetime.now() - timedelta(days=7):
        raise BadRequestException(
            ErrorCode.ERR_CANT_DELETE_COMMENT, ErrorMessage.ERR_CANT_DELETE_COMMENT
        )

    db.exec(
        update(CommentReply).where(CommentReply.id == reply_id).values(deleted_at=True)
    )
    db.commit()
