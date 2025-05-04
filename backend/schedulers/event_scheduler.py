from datetime import datetime, timedelta

from sqlmodel import select

from backend.celery import app
from backend.core.constants import (
    EventStatusCode,
    NotificationTypeCode,
    TransactionStatusCode,
)
from backend.db.database import SessionLocal
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.transaction_item import TransactionItem
from backend.models.user import User
from backend.services.notifications.notification_service import NotificationService
from backend.utils.logger import logger

# Register beat schedule in celery app
app.conf.beat_schedule = {
    "event-reminder-7days": {
        "task": "backend.schedulers.event_scheduler.remind_upcoming_events_7_days_before",
        "schedule": timedelta(minutes=10),  # Run every 10 minutes
    },
    "event-reminder-3days": {
        "task": "backend.schedulers.event_scheduler.remind_upcoming_events_3_days_before",
        "schedule": timedelta(minutes=10),
    },
    "event-reminder-1day": {
        "task": "backend.schedulers.event_scheduler.remind_upcoming_events_1_day_before",
        "schedule": timedelta(minutes=10),
    },
    "event-reminder-10minutes": {
        "task": "backend.schedulers.event_scheduler.remind_upcoming_events_10_minutes_before",
        "schedule": timedelta(minutes=1),  # Run every minute for short-notice reminders
    },
}


@app.task
def remind_upcoming_events_7_days_before():
    """Send reminders to users for events starting in 7 days"""
    _remind_upcoming_events(
        time_window=timedelta(days=7),
        type_code=NotificationTypeCode.UPCOMING_EVENT_REMINDER_7_DAYS_BEFORE,
    )


@app.task
def remind_upcoming_events_3_days_before():
    """Send reminders to users for events starting in 3 days"""
    _remind_upcoming_events(
        time_window=timedelta(days=3),
        type_code=NotificationTypeCode.UPCOMING_EVENT_REMINDER_3_DAYS_BEFORE,
    )


@app.task
def remind_upcoming_events_1_day_before():
    """Send reminders to users for events starting in 1 day"""
    _remind_upcoming_events(
        time_window=timedelta(days=1),
        type_code=NotificationTypeCode.UPCOMING_EVENT_REMINDER_1_DAY_BEFORE,
    )


@app.task
def remind_upcoming_events_10_minutes_before():
    """Send reminders to users for events starting in 10 minutes"""
    _remind_upcoming_events(
        time_window=timedelta(minutes=10),
        type_code=NotificationTypeCode.UPCOMING_EVENT_REMINDER_10_MINUTES_BEFORE,
    )


# -------------------------------------------------------------
# |                  Celery Beat Schedule                      |
# -------------------------------------------------------------


def _remind_upcoming_events(time_window: timedelta, type_code: NotificationTypeCode):
    """
    Helper function to send reminders to users for upcoming events.

    Args:
        time_window: Time before event to send reminder
        reminder_type: Type of reminder (for logging)
        type_code: Notification type code
    """
    now = datetime.now()

    # Calculate target time range for events starting soon
    target_time_start = now + time_window
    target_time_end = target_time_start + timedelta(minutes=10)  # 10-minute window

    with SessionLocal() as db:
        transactions = db.exec(
            select(TransactionItem, User, Event, Ticket)
            .select_from(TransactionItem)
            .join(User, User.id == TransactionItem.user_id)
            .join(Ticket, Ticket.id == TransactionItem.ticket_id)
            .join(Event, Event.id == Ticket.event_id)
            .where(
                TransactionItem.status == TransactionStatusCode.SUCCESS,
                Event.start_at >= target_time_start,
                Event.start_at <= target_time_end,
                Event.status == EventStatusCode.PUBLIC,
            )
        ).all()

        logger.info(
            f"Found {len(transactions)} transactions for upcoming events in the next {time_window}"
        )

        notification_count = 0

        for transaction_item, user, event, ticket in transactions:
            try:
                # Send notification using the notification service
                NotificationService.push_notification(
                    db=db,
                    sender=None,
                    receiver=user,
                    type_code=type_code,
                    action_url=f"/events/{event.slug}",
                    event_name=event.name,
                    event_start_at=event.start_at.isoformat(),
                    full_name=f"{user.first_name} {user.last_name}",
                )
                notification_count += 1
            except Exception as e:
                logger.error(
                    f"Failed to send notification to user {user.id} for event {event.id}: {str(e)}"
                )

            logger.info(f"Sent {notification_count} reminders for event: {event.name}")
