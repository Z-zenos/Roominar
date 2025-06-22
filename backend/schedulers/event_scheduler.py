from datetime import datetime, timedelta

from sqlmodel import select

from backend.celery import app
from backend.core.constants import (
    EventStatusCode,
    NotificationTypeCode,
    TransactionStatusCode,
)
from backend.db.database import SessionLocal
from backend.models.check_in import CheckIn
from backend.models.event import Event
from backend.models.transaction_item import TransactionItem
from backend.models.user import User
from backend.services.notifications.notification_service import NotificationService
from backend.utils.logger import logger

# Register beat schedule in celery app
app.conf.beat_schedule = {
    "event:remind-start-time-before-7d": {
        "task": "backend.schedulers.event_scheduler.remind_start_time_before_7d",
        "schedule": timedelta(minutes=60),
    },
    "event:remind-start-time-before-3d": {
        "task": "backend.schedulers.event_scheduler.remind_start_time_before_3d",
        "schedule": timedelta(minutes=30),
    },
    "event:remind-start-time-before-1d": {
        "task": "backend.schedulers.event_scheduler.remind_start_time_before_1d",
        "schedule": timedelta(minutes=10),
    },
    "event:remind-start-time-before-10m": {
        "task": "backend.schedulers.event_scheduler.remind_start_time_before_10m",
        "schedule": timedelta(minutes=1),  # Run every minute for short-notice reminders
    },
    "event:ended": {
        "task": "backend.schedulers.event_scheduler.handle_ended_events",
        "schedule": timedelta(minutes=3),
    },
}


@app.task
def remind_start_time_before_7d():
    """Send reminders to users for events starting in 7 days"""
    _remind_upcoming_events(
        time_window=timedelta(days=7),
        type_code=NotificationTypeCode.REMIND_EVENT_START_TIME_BEFORE_7D,
    )


@app.task
def remind_start_time_before_3d():
    """Send reminders to users for events starting in 3 days"""
    _remind_upcoming_events(
        time_window=timedelta(days=3),
        type_code=NotificationTypeCode.REMIND_EVENT_START_TIME_BEFORE_3D,
    )


@app.task
def remind_start_time_before_1d():
    """Send reminders to users for events starting in 1 day"""
    _remind_upcoming_events(
        time_window=timedelta(days=1),
        type_code=NotificationTypeCode.REMIND_EVENT_START_TIME_BEFORE_1D,
    )


@app.task
def remind_start_time_before_10m():
    """Send reminders to users for events starting in 10 minutes"""
    _remind_upcoming_events(
        time_window=timedelta(minutes=10),
        type_code=NotificationTypeCode.REMIND_EVENT_START_TIME_BEFORE_10M,
    )


@app.task
def handle_ended_events():
    """Send review request to users after event ended"""
    now = datetime.now()

    with SessionLocal() as db:
        results = db.exec(
            select(Event, User)
            .select_from(CheckIn)
            .join(Event, Event.id == CheckIn.event_id)
            .join(
                TransactionItem,
                TransactionItem.ticket_id == CheckIn.transaction_item_id,
            )
            .join(User, User.id == TransactionItem.user_id)
            .where(
                Event.end_at < now,
                Event.status == EventStatusCode.PUBLIC,
            )
        ).all()

        logger.info(f"EventTask: Found {len(results)} check-ins of ended events.")

        ended_event_ids = set()
        event_updates = []

        for event, user in results:
            try:
                if event.id not in ended_event_ids:
                    if event.status == EventStatusCode.PUBLIC:
                        event.status = EventStatusCode.ENDED
                        event.request_feedback_at = now
                        event_updates.append(event)
                        ended_event_ids.add(event.id)

                # Gửi survey nếu event có survey và chưa gửi
                if event.survey_id and event.request_feedback_at == now:
                    NotificationService.push_notification(
                        db=db,
                        sender=None,
                        receiver=user,
                        type_code=NotificationTypeCode.REQUEST_FEEDBACK_EVENT,
                        action_url=f"/events/{event.slug}/feedback",
                        event_name=event.name,
                        event_start_at=(
                            event.start_at.isoformat() if event.start_at else None
                        ),
                    )

            except Exception as e:
                logger.error(
                    f"EventTask: Error processing event_id={event.id}, user_id={user.id}: {str(e)}"
                )

        # Bulk update
        if event_updates:
            db.bulk_update_mappings(
                Event,
                [
                    e.dict(include={"id", "status", "request_feedback_at"})
                    for e in event_updates
                ],
            )
            db.commit()
            logger.info(f"EventTask: Updated {len(event_updates)} events to ENDED.")


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
    target_time_end = target_time_start + timedelta(minutes=10)  # 10-minute

    event_ids = set()
    event_updates = []

    with SessionLocal() as db:
        transactions = db.exec(
            select(User, Event)
            .select_from(TransactionItem)
            .join(User, User.id == TransactionItem.user_id)
            .join(Event, Event.id == TransactionItem.event_id)
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
        remind_time = None
        match type_code:
            case NotificationTypeCode.REMIND_EVENT_START_TIME_BEFORE_7D:
                remind_time = "remind_start_before_7d_at"
            case NotificationTypeCode.REMIND_EVENT_START_TIME_BEFORE_3D:
                remind_time = "remind_start_before_3d_at"
            case NotificationTypeCode.REMIND_EVENT_START_TIME_BEFORE_1D:
                remind_time = "remind_start_before_1d_at"
            case NotificationTypeCode.REMIND_EVENT_START_TIME_BEFORE_10M:
                remind_time = "remind_start_before_10m_at"

        for user, event in transactions:
            try:
                if event[remind_time] is None:
                    if event.id not in event_ids:
                        event[remind_time] = now
                        event_updates.append(event)
                        event_ids.add(event.id)

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
                raise e

        # Bulk update
        if event_updates:
            db.bulk_update_mappings(
                Event,
                [e.dict(include={"id", remind_time}) for e in event_updates],
            )
            db.commit()
            logger.info(
                f"EventTask: Updated {len(event_updates)} events to {remind_time}."
            )
