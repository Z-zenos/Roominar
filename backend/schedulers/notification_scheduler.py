from firebase_admin import messaging
from firebase_admin.exceptions import FirebaseError
from sqlmodel import select

from backend.models.user_notification_token import UserNotificationToken
from backend.utils.database import transaction_scope


async def validate_fcm_token(token: str) -> bool:
    """Validate if a FCM token is still valid"""
    try:
        # Send a test message with dry_run=True to validate token without actual delivery
        message = messaging.Message(
            data={"test": "true"},
            token=token,
        )
        messaging.send(message, dry_run=True)
        return True
    except FirebaseError as e:
        # Check if the error is due to invalid token
        error_code = getattr(e, "code", "")
        if "invalid-argument" in error_code or "not-registered" in error_code:
            return False
        # For other errors, consider the token valid
        return True


async def cleanup_invalid_tokens():
    """Remove invalid FCM tokens from the database"""
    with transaction_scope(use_master=True) as db:
        tokens = db.exec(select(UserNotificationToken)).all()

        for token in tokens:
            is_valid = await validate_fcm_token(token.fcm_token)
            if not is_valid:
                db.delete(token)

        db.commit()
