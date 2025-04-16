from sqlmodel import Session, select

from backend.api.v1.services.notifications.notification_service import (
    NotificationService,
)
from backend.celery import app
from backend.core.constants import NotificationTypeCode
from backend.db.database import SessionLocal
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.user import User


@app.task(bind=True, max_retries=3, default_retry_delay=5)
def push_bookmark_event_notification(self, db: Session, event_id: int):
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
            receiver=owner, type_code=NotificationTypeCode.BOOKMARK_EVENT
        )
    except Exception as exc:
        raise self.retry(exc=exc)


@app.task(bind=True, max_retries=3, default_retry_delay=5)
def push_apply_event_notification(
    self, event_id: int, sender_id: int, receiver_id: int, ticket_id: int
):
    db = SessionLocal()
    try:
        event = db.get(Event, event_id)
        sender = db.get(User, sender_id)
        receiver = db.get(User, receiver_id)
        ticket = db.get(Ticket, ticket_id)

        if not all([event, sender, receiver, ticket]):
            raise ValueError("Missing event, sender, receiver or ticket")

        NotificationService.push_notification(
            db=db,
            event=event,
            sender=sender,
            receiver=receiver,
            ticket=ticket,
            type_code=NotificationTypeCode.APPLY_EVENT,
        )

        db.commit()
    except Exception as e:
        db.rollback()
        self.retry(exc=e)
        raise
    finally:
        db.close()
