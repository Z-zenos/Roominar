from datetime import datetime, timedelta

import pytz
from sqlmodel import Session, select, update

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.comment import Comment
from backend.models.comment_reply import CommentReply
from backend.models.event import Event


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

    if reply.created_at < datetime.now(pytz.utc) - timedelta(days=7):
        raise BadRequestException(
            ErrorCode.ERR_CANT_DELETE_COMMENT, ErrorMessage.ERR_CANT_DELETE_COMMENT
        )

    comment = db.get(Comment, reply.comment_id)
    event = db.get(Event, comment.event_id)

    db.exec(
        update(CommentReply)
        .where(CommentReply.id == reply_id)
        .values(deleted_at=datetime.now(pytz.utc))
    )
    db.exec(
        update(Comment)
        .where(Comment.id == reply.comment_id)
        .values(reply_count=comment.reply_count - 1)
    )
    db.exec(
        update(Event)
        .where(Event.id == comment.event_id)
        .values(comment_count=event.comment_count - 1)
    )
    db.commit()
