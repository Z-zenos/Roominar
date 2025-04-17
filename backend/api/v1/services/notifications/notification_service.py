from firebase_admin import messaging
from sqlmodel import Session, func, select

from backend.core.constants import Lang, NotificationTypeCode
from backend.core.notification_message import NOTIFICATION_MESSAGES
from backend.models.notification import Notification
from backend.models.user import User
from backend.models.user_notification_token import UserNotificationToken
from backend.schemas.notification import ListingNotificationsQueryParams


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
        try:
            # Build multilingual message
            message = NotificationService.get_notification_message(
                key=type_code,
                lang=lang,
                **kwargs,
            )

            # Save to DB
            notification = Notification(
                sender_id=None if sender is None else sender.id,
                receiver_id=receiver.id,
                content=dict(kwargs),
                type_code=type_code,
            )
            db.add(notification)
            db.commit()

            # Send push to all tokens
            user_notification_tokens = db.exec(
                select(UserNotificationToken.fcm_token).where(
                    UserNotificationToken.user_id == receiver.id
                )
            ).all()

            if user_notification_tokens:
                NotificationService.__send_notification(
                    title=message.get("title", ""),
                    body=message.get("body", ""),
                    tokens=list(user_notification_tokens),
                    data={"type_code": type_code},
                )
        except Exception as e:
            db.rollback()
            raise e

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
