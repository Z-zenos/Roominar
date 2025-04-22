from firebase_admin import messaging
from sqlmodel import Session, func, select

from backend.core.config import logger
from backend.core.constants import Lang, NotificationTypeCode
from backend.core.firebase import get_firebase_app
from backend.core.notification_message import NOTIFICATION_MESSAGES
from backend.db.database import SessionLocal
from backend.models.notification import Notification
from backend.models.user import User
from backend.models.user_notification_token import UserNotificationToken
from backend.schemas.notification import ListingNotificationsQueryParams
from backend.utils.database import save


class NotificationService:
    @staticmethod
    def push_notification(
        db: Session,
        sender: User,
        receiver: User,
        type_code: NotificationTypeCode,
        lang: Lang = "vi",
        action_url: str = None,
        **kwargs,
    ) -> None:
        notification_id = None
        try:
            # First ensure Firebase is initialized
            get_firebase_app()

            # Build multilingual message
            message = NotificationService.get_notification_message(
                key=type_code,
                lang=lang,
                **kwargs,
            )

            # Save to DB first - we want to keep the notification even if FCM fails
            notification = Notification(
                sender_id=None if sender is None else sender.id,
                receiver_id=receiver.id,
                content=dict(kwargs),
                type_code=type_code,
                action_url=action_url,
            )
            notification = save(db, notification)
            notification_id = notification.id

            # Send push to all tokens
            user_notification_tokens = db.exec(
                select(UserNotificationToken.fcm_token).where(
                    UserNotificationToken.user_id == receiver.id
                )
            ).all()

            # Extract token strings from result
            token_strings = [
                token[0] for token in user_notification_tokens if token and token[0]
            ]

            if token_strings:
                try:
                    NotificationService.__send_notification(
                        title=message.get("title", ""),
                        body=message.get("body", ""),
                        tokens=token_strings,
                        data={
                            "type_code": type_code,
                            "notification_id": str(notification_id),
                        },
                    )
                except Exception as e:
                    # Log error but don't roll back - notification is still saved in DB
                    logger.error(
                        f"Failed to send push notification to user {receiver.id}: {str(e)}"
                    )
            else:
                logger.info(
                    f"No FCM tokens found for user {receiver.id}, notification saved to DB only"
                )

        except Exception as e:
            # Only rollback if we haven't committed the notification yet
            if notification_id is None:
                db.rollback()
            logger.error(f"Error in push_notification: {str(e)}")
            raise

    @staticmethod
    async def listing_notifications(
        db: Session,
        query_params: ListingNotificationsQueryParams,
        user_id: int,
        lang: Lang = "vi",
    ) -> list[dict]:
        notifications = (
            db.exec(
                select(Notification.__table__.columns, User.avatar_url, User.id)
                .select_from(Notification)
                .outerjoin(User, Notification.sender_id == User.id)
                .where(Notification.receiver_id == user_id)
                .where(
                    Notification.is_read.is_(query_params.is_read)
                    if query_params.is_read is not None
                    else True
                )
                .order_by(Notification.created_at.desc())
                .limit(query_params.per_page)
                .offset((query_params.page - 1) * query_params.per_page)
            )
            .mappings()
            .all()
        )

        result = []
        for n in notifications:
            type_code = n.type_code
            content = NotificationService.get_notification_message(
                key=type_code,
                lang=lang,
                **n.content,  # reuse stored params
            )
            result.append(
                {
                    "id": n.id,
                    "type_code": type_code,
                    "content": content.get("body"),
                    "is_read": n.is_read,
                    "created_at": n.created_at,
                    "avatar_url": n.avatar_url,
                    "sender_id": n.sender_id,
                    "action_url": n.action_url,
                }
            )

        return result

    @staticmethod
    async def count_notifications(
        db: Session,
        user_id: int,
    ) -> int:
        return (
            db.scalar(select(func.count()).where(Notification.receiver_id == user_id))
            or 0
        )

    @staticmethod
    async def mark_notification_as_read(
        db: Session, user: User, notification_id: int
    ) -> Notification | None:
        try:
            notification = db.get(Notification, notification_id)
            if not notification:
                return None

            if notification.receiver_id != user.id:
                raise PermissionError(
                    "You do not have permission to access this notification."
                )

            notification.is_read = True
            db.add(notification)
            db.commit()
            return notification_id

        except Exception as e:
            db.rollback()
            raise e

    @staticmethod
    async def count_unread_notifications(db: Session, user_id: int) -> int:
        return (
            db.scalar(
                select(func.count())
                .select_from(Notification)
                .where(
                    Notification.receiver_id == user_id, Notification.is_read.is_(False)
                )
            )
            or 0
        )

    @staticmethod
    def __send_notification(
        title: str,
        body: str,
        tokens: list[str],
        data: dict = None,
    ) -> messaging.BatchResponse:
        """Send FCM notification with improved error handling"""
        if not tokens:
            logger.warning("No FCM tokens provided for notification")
            return None

        # Ensure data is properly formatted for FCM
        if data:
            # Convert all values to strings as FCM requires
            data = {k: str(v) for k, v in data.items()}
        else:
            data = {}

        message = messaging.MulticastMessage(
            notification=messaging.Notification(title=title, body=body),
            data=data,
            tokens=tokens,
        )

        try:
            response = messaging.send_multicast(message)

            # Handle and log failed tokens
            if response.failure_count > 0:
                failed_tokens = []
                for idx, result in enumerate(response.responses):
                    if not result.success:
                        error = result.exception
                        failed_tokens.append(
                            {
                                "token": tokens[idx],
                                "error": str(error) if error else "Unknown error",
                            }
                        )

                        # This token should be removed from database
                        NotificationService._clean_invalid_token(tokens[idx])

                logger.error(
                    f"Failed to send {response.failure_count} notifications: {failed_tokens}"
                )

            logger.info(
                f"Successfully sent {response.success_count} of {len(tokens)} notifications"
            )
            return response

        except messaging.UnregisteredError:
            logger.error("FCM tokens not registered")
            # Invalid tokens should be removed
            for token in tokens:
                NotificationService._clean_invalid_token(token)
            raise RuntimeError(
                "Failed to send notification: Device tokens not registered"
            )

        except Exception as e:
            logger.error(f"FCM send error: {str(e)}")
            raise RuntimeError(f"Failed to send notification: {str(e)}")

    @staticmethod
    def _clean_invalid_token(token: str):
        """Remove invalid FCM token from database"""
        try:
            with SessionLocal() as db:
                token_record = db.exec(
                    select(UserNotificationToken).where(
                        UserNotificationToken.fcm_token == token
                    )
                ).first()

                if token_record:
                    db.delete(token_record)
                    db.commit()
                    logger.info(f"Removed invalid FCM token: {token[:10]}...")
        except Exception as e:
            logger.error(f"Error removing invalid token: {str(e)}")

    @staticmethod
    def get_notification_message(
        key: NotificationTypeCode, lang: Lang = "vi", **kwargs
    ) -> dict:
        try:
            template = NOTIFICATION_MESSAGES[key][lang]
            return {
                "title": template["title"].format(**kwargs),
                "body": template["body"].format(**kwargs),
            }
        except KeyError:
            return {"title": key, "body": ""}
