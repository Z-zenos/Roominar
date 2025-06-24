from sqlmodel import Session, exists, update

from backend.core.constants import UserActionTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models import Bookmark, User
from backend.models.event import Event
from backend.models.user_action import UserAction


async def create_event_bookmark(db: Session, current_user: User, event_id: int):
    bookmark = db.scalar(
        exists()
        .where(Bookmark.user_id == current_user.id, Bookmark.event_id == event_id)
        .select()
    )

    if bookmark:
        raise BadRequestException(
            ErrorCode.ERR_BOOKMARK_ALREADY_EXISTED,
            ErrorMessage.ERR_BOOKMARK_ALREADY_EXISTED,
        )

    try:
        new_bookmark = Bookmark(user_id=current_user.id, event_id=event_id)
        db.add(new_bookmark)
        db.add(
            UserAction(
                user_id=current_user.id,
                event_id=event_id,
                action_type=UserActionTypeCode.BOOKMARK,
            )
        )
        db.exec(
            update(Event)
            .where(Event.id == event_id)
            .values(bookmark_count=Event.bookmark_count + 1)
        )
        db.commit()
        db.refresh(new_bookmark)

        return new_bookmark.id

    except Exception as e:
        db.rollback()
        raise e
