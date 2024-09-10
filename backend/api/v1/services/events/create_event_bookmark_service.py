from sqlmodel import Session, exists

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models import Bookmark, User


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
        bookmark = Bookmark(user_id=current_user.id, event_id=event_id)
        db.add(bookmark)
        db.commit()

        return bookmark.id

    except Exception as e:
        db.rollback()
        raise e
