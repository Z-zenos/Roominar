from sqlmodel import Session, select

from backend.celery import app
from backend.core.constants import NotificationTypeCode
from backend.db.database import SessionLocal
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.user import User
from backend.services.notifications.notification_service import NotificationService


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
            sender=sender,
            receiver=receiver,
            type_code=NotificationTypeCode.APPLY_EVENT,
            event_name=event.name,
            full_name=f"{sender.first_name} {sender.last_name}",
            ticket_name=ticket.name,
        )

    except Exception as e:
        print(e)
        self.retry(exc=e)
        raise
    finally:
        db.close()


@app.task(bind=True, max_retries=3, default_retry_delay=5)
def push_check_in_event_notification(
    self, event_id: int, receiver_id: int, ticket_id: int
):
    db = SessionLocal()
    try:
        event = db.get(Event, event_id)
        receiver = db.get(User, receiver_id)
        ticket = db.get(Ticket, ticket_id)

        if not all([event, receiver, ticket]):
            raise ValueError("Missing event, sender, receiver or ticket")

        NotificationService.push_notification(
            db=db,
            sender=None,
            receiver=receiver,
            type_code=NotificationTypeCode.CHECK_IN_EVENT,
            event_name=event.name,
            ticket_name=ticket.name,
        )

    except Exception as e:
        print(e)
        self.retry(exc=e)
        raise
    finally:
        db.close()
