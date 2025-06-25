from sqlmodel import Session, select

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.bookmark import Bookmark
from backend.models.event import Event
from backend.models.user import User
from backend.utils.database import save_and_commit, transaction_scope


def create_event_bookmark(db: Session, current_user: User, event_id: int):
    """Create a bookmark for an event"""

    with transaction_scope() as session:
        # Check if event exists
        event = session.exec(select(Event).where(Event.id == event_id)).first()
        if not event:
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NOT_FOUND, ErrorMessage.ERR_EVENT_NOT_FOUND
            )

        # Check if bookmark already exists
        existing_bookmark = session.exec(
            select(Bookmark).where(
                Bookmark.user_id == current_user.id, Bookmark.event_id == event_id
            )
        ).first()

        if existing_bookmark:
            return existing_bookmark.id  # Return existing bookmark ID

        # Create new bookmark
        bookmark = Bookmark(user_id=current_user.id, event_id=event_id)

        session.add(bookmark)
        session.commit()
        session.refresh(bookmark)
        bookmark_id = bookmark.id

        # Invalidate related caches
        from backend.core.simple_cache import (
            invalidate_event_caches,
            invalidate_user_caches,
        )

        invalidate_event_caches(event_id)
        invalidate_user_caches(current_user.id)

        return bookmark_id
