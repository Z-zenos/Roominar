from sqlmodel import Session, select

from backend.api.v1.services.notifications.notification_service import (
    NotificationService,
)
from backend.celery import app
from backend.core.constants import NotificationTypeCode
from backend.models.event import Event
from backend.models.user import User


@app.task(bind=True, max_retries=3, default_retry_delay=5)
async def push_bookmark_event_notification(self, db: Session, event_id: int):
    try:
        event = db.get(Event, event_id)
        if not event:
            return

        owner = db.exec(
            select(User)
            .join(Event, Event.organization_id == User.organization_id)
            .where(Event.id == event_id)
        ).one_or_none()

        if not owner:
            return

        NotificationService.push_notification(
            receiver=owner, type_code=NotificationTypeCode.EVENT_BOOKMARKED
        )
    except Exception as exc:
        raise self.retry(exc=exc)
