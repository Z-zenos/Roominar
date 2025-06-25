from datetime import date, datetime
from typing import Optional

from firebase_admin import messaging
from sqlmodel import Session, func, select

from backend.core.config import logger
from backend.core.constants import Lang, NotificationTypeCode
from backend.core.firebase import get_firebase_app
from backend.core.notification_message import NOTIFICATION_MESSAGES
from backend.core.simple_cache import CacheKeys, cached_response
from backend.models.notification import Notification
from backend.models.user import User
from backend.models.user_notification_token import UserNotificationToken
from backend.schemas.notification import ListingNotificationsQueryParams
from backend.utils.database import save_and_commit, transaction_scope


class NotificationService:
    @staticmethod
    def push_notification(
        receiver: User,
        type_code: NotificationTypeCode,
        sender: Optional[User] = None,
        lang: Lang = "vi",
        action_url: Optional[str] = None,
        db: Optional[Session] = None,
        **kwargs,
    ) -> None:
        """
        Push notification to user with proper session management

        Args:
            receiver: User receiving the notification
            type_code: Type of notification
            sender: User sending the notification (optional)
            lang: Language for the notification
            action_url: URL for notification action
            db: Optional database session (if None, creates new session)
            **kwargs: Additional parameters for notification content
        """
        if not receiver or not type_code:
            raise ValueError("receiver and type_code are required")

        # If no database session provided, create a new one
        if db is None:
            with transaction_scope(use_master=True) as session:
                NotificationService._send_notification_internal(
                    db=session,
                    sender=sender,
                    receiver=receiver,
                    type_code=type_code,
                    lang=lang,
                    action_url=action_url,
                    **kwargs,
                )
        else:
            # Use provided session
            NotificationService._send_notification_internal(
                db=db,
                sender=sender,
                receiver=receiver,
                type_code=type_code,
                lang=lang,
                action_url=action_url,
                **kwargs,
            )

    @staticmethod
    def _send_notification_internal(
        db: Session,
        receiver: User,
        type_code: NotificationTypeCode,
        sender: Optional[User] = None,
        lang: Lang = "vi",
        action_url: Optional[str] = None,
        **kwargs,
    ) -> None:
        """Internal method to send notification with existing session"""
        notification_id = None
        try:
            # Ensure Firebase is initialized
            get_firebase_app()

            # Build multilingual message
            message = NotificationService.get_notification_message(
                key=type_code,
                lang=lang,
                **kwargs,
            )

            # Save to DB first
            notification = Notification(
                sender_id=sender.id if sender else None,
                receiver_id=receiver.id,
                content=dict(kwargs),
                type_code=type_code,
                action_url=action_url,
                created_by=sender.id if sender else receiver.id,
                updated_by=sender.id if sender else receiver.id,
            )
            notification = save_and_commit(db, notification)
            notification_id = notification.id

            # Invalidate user notification cache after new notification
            from backend.core.simple_cache import invalidate_user_caches

            invalidate_user_caches(receiver.id)

            # Get user FCM tokens
            user_tokens = db.exec(
                select(UserNotificationToken.fcm_token).where(
                    UserNotificationToken.user_id == receiver.id
                )
            ).all()

            # Extract token strings
            token_strings = [token for token in user_tokens if token]

            if token_strings:
                try:
                    NotificationService._send_fcm_notification(
                        title=message.get("title", ""),
                        body=message.get("body", ""),
                        tokens=token_strings,
                        data={
                            "type_code": type_code,
                            "notification_id": str(notification_id),
                        },
                    )
                except Exception as e:
                    logger.error(
                        f"Failed to send FCM notification to user {receiver.id}: {str(e)}"
                    )
            else:
                logger.info(
                    f"No FCM tokens found for user {receiver.id}, notification saved to DB only"
                )

        except Exception as e:
            logger.error(f"Error in push_notification: {str(e)}")
            raise

    @staticmethod
    @cached_response(
        cache_key="notifications:list",
        ttl=120,  # 2 minutes for frequently changing data
        include_user=True,
        include_params=True,
    )
    def listing_notifications(
        user_id: int,
        query_params: ListingNotificationsQueryParams,
        lang: Lang = "vi",
        db: Optional[Session] = None,
    ) -> list[dict]:
        """
        List notifications for a user with proper session management
        """

        def _get_notifications(session: Session) -> list[dict]:
            # Build base query
            query = (
                select(Notification, User.avatar_url)
                .join(User, Notification.sender_id == User.id, isouter=True)
                .where(Notification.receiver_id == user_id)
                .order_by(Notification.created_at.desc())
                .limit(query_params.per_page or 20)
                .offset(((query_params.page or 1) - 1) * (query_params.per_page or 20))
            )

            # Add read filter if specified
            if query_params.is_read is not None:
                query = query.where(Notification.is_read == query_params.is_read)

            results = session.exec(query).all()

            result = []
            for notification, avatar_url in results:
                # Parse date fields to strings
                parsed_content = NotificationService._parse_dates_to_strings(
                    notification.content or {}
                )
                content = NotificationService.get_notification_message(
                    key=NotificationTypeCode(notification.type_code),
                    lang=lang,
                    **parsed_content,
                )
                result.append(
                    {
                        "id": notification.id,
                        "type_code": notification.type_code,
                        "content": content.get("body"),
                        "is_read": notification.is_read,
                        "created_at": notification.created_at,
                        "avatar_url": avatar_url,
                        "sender_id": notification.sender_id,
                        "action_url": notification.action_url,
                    }
                )

            return result

        if db is None:
            with transaction_scope(use_master=False) as session:
                return _get_notifications(session)
        else:
            return _get_notifications(db)

    @staticmethod
    @cached_response(
        cache_key="notifications:count",
        ttl=300,  # 5 minutes
        include_user=True,
        include_params=True,
    )
    def count_notifications(
        user_id: int,
        is_read: Optional[bool] = None,
        db: Optional[Session] = None,
    ) -> int:
        """Count notifications for a user with caching"""

        def _count_notifications(session: Session) -> int:
            query = select(func.count(Notification.id)).where(
                Notification.receiver_id == user_id
            )

            if is_read is not None:
                query = query.where(Notification.is_read == is_read)

            return session.exec(query).one()

        if db is None:
            with transaction_scope(use_master=False) as session:
                return _count_notifications(session)
        else:
            return _count_notifications(db)

    @staticmethod
    def mark_notification_as_read(
        user: User,
        notification_id: int,
        db: Optional[Session] = None,
    ) -> Optional[Notification]:
        """Mark notification as read and invalidate cache"""

        def _mark_as_read(session: Session) -> Optional[Notification]:
            notification = session.exec(
                select(Notification).where(
                    Notification.id == notification_id,
                    Notification.receiver_id == user.id,
                )
            ).first()

            if notification and not notification.is_read:
                notification.is_read = True
                notification.updated_by = user.id
                session.add(notification)
                session.commit()
                session.refresh(notification)

                # Invalidate user notification cache
                from backend.core.simple_cache import invalidate_user_caches

                invalidate_user_caches(user.id)

                return notification

            return notification

        if db is None:
            with transaction_scope(use_master=True) as session:
                return _mark_as_read(session)
        else:
            return _mark_as_read(db)

    @staticmethod
    @cached_response(
        cache_key="notifications:unread_count",
        ttl=180,  # 3 minutes for frequently updated data
        include_user=True,
        include_params=False,
    )
    def count_unread_notifications(user_id: int, db: Optional[Session] = None) -> int:
        """Count unread notifications with caching"""

        def _count_unread(session: Session) -> int:
            return session.exec(
                select(func.count(Notification.id)).where(
                    Notification.receiver_id == user_id,
                    Notification.is_read == False,
                )
            ).one()

        if db is None:
            with transaction_scope(use_master=False) as session:
                return _count_unread(session)
        else:
            return _count_unread(db)

    @staticmethod
    def _send_fcm_notification(
        title: str,
        body: str,
        tokens: list[str],
        data: Optional[dict] = None,
    ) -> Optional[messaging.BatchResponse]:
        """Send FCM notification to multiple tokens"""
        if not tokens:
            return None

        try:
            # Prepare message data
            message_data = data or {}

            # Create multicast message
            multicast_message = messaging.MulticastMessage(
                notification=messaging.Notification(
                    title=title,
                    body=body,
                ),
                data=message_data,
                tokens=tokens,
                android=messaging.AndroidConfig(
                    notification=messaging.AndroidNotification(
                        click_action="FLUTTER_NOTIFICATION_CLICK",
                        channel_id="default",
                    )
                ),
                apns=messaging.APNSConfig(
                    payload=messaging.APNSPayload(
                        aps=messaging.Aps(
                            sound="default",
                            badge=1,
                        )
                    )
                ),
            )

            # Send the message
            response = messaging.send_multicast(multicast_message)

            # Handle failed tokens
            if response.failure_count > 0:
                failed_tokens = []
                for idx, resp in enumerate(response.responses):
                    if not resp.success:
                        failed_tokens.append(tokens[idx])
                        error_code = (
                            resp.exception.code if resp.exception else "unknown"
                        )
                        logger.warning(
                            f"Failed to send notification to token {tokens[idx]}: {error_code}"
                        )

                        # Clean invalid tokens
                        if error_code in [
                            "registration-token-not-registered",
                            "invalid-registration-token",
                        ]:
                            NotificationService._clean_invalid_token(tokens[idx])

            logger.info(
                f"FCM notification sent: {response.success_count} success, {response.failure_count} failed"
            )

            return response

        except Exception as e:
            logger.error(f"Error sending FCM notification: {str(e)}")
            return None

    @staticmethod
    def _clean_invalid_token(token: str):
        """Remove invalid FCM token from database"""
        try:
            with transaction_scope(use_master=True) as session:
                token_record = session.exec(
                    select(UserNotificationToken).where(
                        UserNotificationToken.fcm_token == token
                    )
                ).first()

                if token_record:
                    session.delete(token_record)
                    session.commit()
                    logger.info(f"Removed invalid FCM token: {token}")

        except Exception as e:
            logger.error(f"Error cleaning invalid token {token}: {str(e)}")

    @staticmethod
    def _parse_dates_to_strings(content: dict) -> dict:
        """Parse date objects to strings for message formatting"""
        parsed_content = {}
        for key, value in content.items():
            if isinstance(value, (date, datetime)):
                parsed_content[key] = value.strftime("%Y-%m-%d %H:%M:%S")
            else:
                parsed_content[key] = value
        return parsed_content

    @staticmethod
    def get_notification_message(
        key: NotificationTypeCode, lang: Lang = "vi", **kwargs
    ) -> dict:
        """Get localized notification message"""
        messages = NOTIFICATION_MESSAGES.get(key, {})
        lang_messages = messages.get(lang, messages.get("vi", {}))

        if not lang_messages:
            return {"title": "Notification", "body": "You have a new notification"}

        try:
            return {
                "title": lang_messages.get("title", "").format(**kwargs),
                "body": lang_messages.get("body", "").format(**kwargs),
            }
        except KeyError as e:
            logger.warning(f"Missing parameter {e} for notification {key}")
            return {"title": "Notification", "body": "You have a new notification"}
