from sqlmodel import Session, select

from backend.core.constants import DeviceTypeCode
from backend.models.user_notification_token import UserNotificationToken
from backend.utils.database import save


async def register_notification_device_token(
    db: Session, user_id: int, fcm_token: str, device_type: str = DeviceTypeCode.WEB
) -> UserNotificationToken:
    """Register or update a device token for a user"""

    # Check if token already exists in the database
    existing_token = db.exec(
        select(UserNotificationToken).where(
            UserNotificationToken.fcm_token == fcm_token
        )
    ).one_or_none()

    # If token exists but belongs to another user, reassign it
    if existing_token and existing_token.user_id != user_id:
        existing_token.user_id = user_id
        existing_token.device_type = device_type
        existing_token = save(db, existing_token)
        return existing_token

    # If token doesn't exist, create a new entry
    if not existing_token:
        new_token = UserNotificationToken(
            user_id=user_id, fcm_token=fcm_token, device_type=device_type
        )
        new_token = save(db, new_token)
        return new_token

    # If token exists for this user, update device type if changed
    if existing_token.device_type != device_type:
        existing_token.device_type = device_type
        save(db, existing_token)

    return existing_token
