from sqlmodel import Session, select

from backend.models.user_notification_token import UserNotificationToken
from backend.utils.database import fetch_all


async def get_notification_device_tokens(
    db: Session, user_id: int
) -> list[UserNotificationToken]:
    """Get all device tokens for a user"""
    tokens = fetch_all(
        db,
        select(UserNotificationToken).where(UserNotificationToken.user_id == user_id),
    )

    return tokens
