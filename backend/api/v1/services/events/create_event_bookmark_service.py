from fastapi import BackgroundTasks
from sqlmodel import Session, exists

from backend.api.v1.services.notifications.notification_service import (
    NotificationService,
)
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models import Bookmark, User


async def create_event_bookmark(
    db: Session, background_tasks: BackgroundTasks, current_user: User, event_id: int
):
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
        db.commit()

        background_tasks.add_task(
            NotificationService.push_event_bookmarked_notification,
            db=db,
            sender=current_user,
            event_id=event_id,
        )

        return new_bookmark.id

    except Exception as e:
        db.rollback()
        raise e
