from sqlmodel import Session, select

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.bookmark import Bookmark
from backend.models.user import User
from backend.utils.database import transaction_scope


def delete_event_bookmark(db: Session, current_user: User, event_id: int):
    """Delete an event bookmark"""

    with transaction_scope() as session:
        # Find the bookmark
        bookmark = session.exec(
            select(Bookmark).where(
                Bookmark.user_id == current_user.id, Bookmark.event_id == event_id
            )
        ).first()

        if not bookmark:
            raise BadRequestException(
                ErrorCode.ERR_BOOKMARK_NOT_FOUND, ErrorMessage.ERR_BOOKMARK_NOT_FOUND
            )

        # Delete the bookmark
        session.delete(bookmark)
        session.commit()

        # Invalidate related caches
        from backend.core.simple_cache import (
            invalidate_event_caches,
            invalidate_user_caches,
        )

        invalidate_event_caches(event_id)
        invalidate_user_caches(current_user.id)

        return True
