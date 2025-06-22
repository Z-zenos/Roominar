from sqlmodel import Session, select, update

from backend.core.constants import UserActionTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models import Bookmark, User
from backend.models.event import Event
from backend.models.user_action import UserAction


async def delete_event_bookmark(db: Session, current_user: User, event_id: int):
    bookmark = db.exec(
        select(Bookmark).where(
            Bookmark.user_id == current_user.id, Bookmark.event_id == event_id
        )
    ).one_or_none()

    if not bookmark:
        raise BadRequestException(
            ErrorCode.ERR_BOOKMARK_NOT_FOUND, ErrorMessage.ERR_BOOKMARK_NOT_FOUND
        )

    try:
        db.delete(bookmark)
        db.add(
            UserAction(
                user_id=current_user.id,
                event_id=event_id,
                action_type=UserActionTypeCode.UNBOOKMARK,
            )
        )
        db.exec(
            update(Event)
            .where(Event.id == event_id)
            .values(bookmark_count=Event.bookmark_count - 1)
        )
        db.commit()

    except Exception as e:
        db.rollback()
        raise e
