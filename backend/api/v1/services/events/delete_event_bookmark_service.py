from sqlmodel import Session, select

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models import Bookmark, User


def delete_event_bookmark(db: Session, current_user: User, event_id: int):
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
        db.commit()

    except Exception as e:
        db.rollback()
        raise e
