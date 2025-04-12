from firebase_admin import messaging
from sqlmodel import Session, select

from backend.core.constants import Lang, NotificationTypeCode
from backend.core.notification_message import NOTIFICATION_MESSAGES
from backend.models.notification import Notification
from backend.models.user import User
from backend.models.user_notification_token import UserNotificationToken


class NotificationService:
    @staticmethod
    def push_notification(
        db: Session,
        sender: User,
        receiver: User,
        type_code: NotificationTypeCode,
        lang: Lang = "vi",
        **kwargs,
    ) -> None:
        # Build multilingual message
        message = NotificationService.get_notification_message(
            key=type_code,
            lang=lang,
            **kwargs,
        )

        # Save to DB
        notification = Notification(
            sender_id=sender.id,
            receiver_id=receiver.id,
            content=message,
            type_code=type_code,
        )
        db.add(notification)
        db.commit()

        # Send push to all tokens
        user_notification_tokens = (
            db.exec(
                select(UserNotificationToken.fcm_token).where(
                    UserNotificationToken.user_id == receiver.id
                )
            )
            .scalars()
            .all()
        )

        if user_notification_tokens:
            NotificationService.__send_notification(
                title=message.get("title", ""),
                body=message.get("body", ""),
                tokens=user_notification_tokens,
                data={**message, "type_code": type_code},
            )

    @staticmethod
    def listing_notifications(
        db: Session, user_id: int, lang: Lang = "vi"
    ) -> list[dict]:
        notifications = (
            db.exec(select(Notification).where(Notification.receiver_id == user_id))
            .scalars()
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
                    "title": content.get("title"),
                    "body": content.get("body"),
                    "is_read": n.is_read,
                    "created_at": n.created_at,
                }
            )

        return result

    @staticmethod
    def mark_notification_as_read(
        db: Session, notification_id: int
    ) -> Notification | None:
        notification = (
            db.exec(select(Notification).where(Notification.id == notification_id))
            .scalars()
            .first()
        )

        if notification:
            notification.is_read = True
            db.add(notification)
            db.commit()
            return notification

        return None

    @staticmethod
    def count_unread_notifications(db: Session, user_id: int) -> int:
        return db.exec(
            select(Notification).where(
                Notification.receiver_id == user_id, Notification.is_read.is_(False)
            )
        ).count()

    @staticmethod
    def __send_notification(
        title: str,
        body: str,
        tokens: list[str],
        data: dict = None,
    ) -> messaging.BatchResponse:
        message = messaging.MulticastMessage(
            notification=messaging.Notification(title=title, body=body),
            data=data or {},
            tokens=tokens,
        )

        try:
            response = messaging.send_multicast(message)
            return response
        except Exception as e:
            # Log the error or handle it as needed
            raise RuntimeError(f"Failed to send notification: {e}")

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
