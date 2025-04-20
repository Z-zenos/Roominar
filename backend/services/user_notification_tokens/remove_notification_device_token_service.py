from sqlmodel import Session, select

from backend.models.user_notification_token import UserNotificationToken


async def remove_notification_device_token(db: Session, fcm_token: str) -> bool:
    """Remove a device token from the database"""
    token = db.exec(
        select(UserNotificationToken).where(
            UserNotificationToken.fcm_token == fcm_token
        )
    ).one_or_none()

    if token:
        db.delete(token)
        db.commit()
        return True

    return False
