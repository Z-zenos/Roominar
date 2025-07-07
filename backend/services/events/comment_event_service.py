from datetime import datetime

import pytz
from sqlmodel import Session, update

from backend.core.constants import UserActionTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.comment import Comment
from backend.models.event import Event
from backend.models.user import User
from backend.models.user_action import UserAction
from backend.schemas.comment import CommentEventRequest


async def comment_event(
    db: Session,
    user: User,
    request: CommentEventRequest,
    event_id: int,
):
    event = db.get(Event, event_id)

    if not event:
        raise BadRequestException(
            ErrorCode.ERR_EVENT_NOT_FOUND, ErrorMessage.ERR_EVENT_NOT_FOUND
        )

    if event.end_at < datetime.now(pytz.utc):
        raise BadRequestException(
            ErrorCode.ERR_EVENT_ENDED, ErrorMessage.ERR_EVENT_ENDED
        )

    comment = Comment(
        event_id=event_id,
        user_id=user.id,
        content=request.content,
    )

    db.exec(
        update(Event)
        .where(Event.id == event_id)
        .values(comment_count=event.comment_count + 1)
    )

    user_action = UserAction(
        user_id=user.id,
        action_type=UserActionTypeCode.COMMENT,
        action_id=comment.id,
    )

    db.add(comment)
    db.add(user_action)
    db.commit()
    db.refresh(comment)

    return comment.id
