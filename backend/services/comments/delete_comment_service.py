from datetime import datetime, timedelta

import pytz
from sqlmodel import Session, update

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.comment import Comment
from backend.models.event import Event


async def delete_comment(
    db: Session,
    comment: Comment,
):
    if comment.created_at < datetime.now(pytz.utc) - timedelta(days=7):
        raise BadRequestException(
            ErrorCode.ERR_CANT_DELETE_COMMENT, ErrorMessage.ERR_CANT_DELETE_COMMENT
        )

    event = db.get(Event, comment.event_id)
    db.exec(
        update(Comment)
        .where(Comment.id == comment.id)
        .values(deleted_at=datetime.now(pytz.utc))
    )
    db.exec(
        update(Event)
        .where(Event.id == comment.event_id)
        .values(comment_count=event.comment_count - 1)
    )
    db.commit()
