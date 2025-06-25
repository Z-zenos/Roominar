from datetime import datetime

from fastapi import BackgroundTasks
from sqlmodel import Session

import backend.services.auth as auth_service
from backend.core.config import settings
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.core.simple_cache import invalidate_user_auth_cache
from backend.mails.mail import Email
from backend.models.user import RoleCode, User
from backend.schemas.auth import ChangeEmailRequest
from backend.utils.database import transaction_scope


async def _send_change_email_notifications(
    mailer: Email,
    user: User,
    verify_token: str,
    revert_token: str,
    verify_expire_at: datetime,
    revert_expire_at: datetime,
) -> None:
    """Send email notifications for email change request to both old and new email addresses."""
    # Send verification email to new email
    if user.new_email:  # Type guard
        request_context = {
            "first_name": user.first_name,
            "email_changed_at": datetime.now().strftime("%Y/%m/%d %H:%M"),
            "verify_change_email_url": f"{settings.WEB_URL}/email/change/{verify_token}",
            "expire_at": verify_expire_at.strftime("%Y/%m/%d %H:%M"),
        }

        await mailer.send_aud_email(
            user.new_email,
            "request_change_email.html",
            "Confirm Your Email Change Request",
            request_context,
        )

    # Send alert email to old email
    if user.old_email:  # Type guard
        alert_context = {
            "email_changed_at": datetime.now().strftime("%Y/%m/%d %H:%M"),
            "revert_email_url": f"{settings.WEB_URL}/email/revert/{revert_token}",
            "expire_at": revert_expire_at.strftime("%Y/%m/%d %H:%M"),
        }

        await mailer.send_aud_email(
            user.old_email,
            "alert_change_email.html",
            "Alert Change Email",
            alert_context,
        )


def request_change_email(
    db: Session,
    current_user: User,
    request: ChangeEmailRequest,
    background_tasks: BackgroundTasks,
) -> User:
    """
    Request to change a user's email address with proper validation and notification.

    Args:
        db: Database session
        current_user: Current authenticated user
        request: Change email request containing new email and password
        background_tasks: FastAPI background tasks for async operations

    Returns:
        Updated user object

    Raises:
        BadRequestException: For various validation failures
    """
    email = request.new_email

    # Validate new email
    if current_user.email == email:
        raise BadRequestException(
            ErrorCode.ERR_INVALID_EMAIL, ErrorMessage.ERR_INVALID_EMAIL
        )

    # Check if email is already taken
    if auth_service.get_user_by_email(db, email, RoleCode.AUDIENCE):
        raise BadRequestException(
            ErrorCode.ERR_EMAIL_ALREADY_EXISTED, ErrorMessage.ERR_EMAIL_ALREADY_EXISTED
        )

    # Verify current password
    if not auth_service.verify_password(request.password, current_user.password):
        raise BadRequestException(
            ErrorCode.ERR_INVALID_PASSWORD, ErrorMessage.ERR_INVALID_PASSWORD
        )

    # Ensure settings values are integers
    verify_expire_minutes = getattr(
        settings, "VERIFY_CHANGE_EMAIL_TOKEN_EXPIRE_MINUTES", 60
    )
    verify_token_length = getattr(settings, "RESET_PASSWORD_TOKEN_LENGTH", 32)
    revert_expire_minutes = getattr(settings, "REVERT_EMAIL_TOKEN_EXPIRE_MINUTES", 1440)
    revert_token_length = getattr(settings, "REVERT_EMAIL_TOKEN_LENGTH", 32)

    # Generate verification tokens
    verify_token_data = auth_service.gen_encrypted_token(
        verify_expire_minutes,
        verify_token_length,
    )
    verify_token, encrypted_verify_token, verify_expire_at = verify_token_data

    revert_token_data = auth_service.gen_encrypted_token(
        revert_expire_minutes,
        revert_token_length,
    )
    revert_token, encrypted_revert_token, revert_expire_at = revert_token_data

    with transaction_scope() as session:
        # Update user with new email data
        current_user.old_email = current_user.email
        current_user.new_email = email
        current_user.verify_change_email_token = encrypted_verify_token
        current_user.verify_change_email_token_expire_at = verify_expire_at
        current_user.revert_email_token = encrypted_revert_token
        current_user.revert_email_token_expire_at = revert_expire_at

        session.add(current_user)
        session.commit()
        session.refresh(current_user)

        # Send notifications in background
        mailer = Email()
        background_tasks.add_task(
            _send_change_email_notifications,
            mailer,
            current_user,
            verify_token,
            revert_token,
            verify_expire_at,
            revert_expire_at,
        )

        # Invalidate user auth cache
        invalidate_user_auth_cache(current_user.id, email, current_user.role)

        return current_user


def verify_new_email(
    db: Session, user: User, background_tasks: BackgroundTasks
) -> User:
    """
    Verify and complete the email change process.

    Args:
        db: Database session
        user: User object with pending email change
        background_tasks: FastAPI background tasks for async operations

    Returns:
        Updated user object with new email
    """
    if not user.new_email:
        raise BadRequestException(
            ErrorCode.ERR_INVALID_EMAIL,
            "No pending email change found",
        )

    with transaction_scope() as session:
        now = datetime.now()

        # Update user email
        user.email = user.new_email
        user.new_email = None
        user.verify_change_email_token = None
        user.verify_change_email_token_expire_at = None
        user.email_verified_at = now
        user.email_changed_at = now

        session.add(user)
        session.commit()
        session.refresh(user)

        # Send success notifications in background
        mailer = Email()

        # Success email to new email
        success_context = {
            "first_name": user.first_name,
            "email_changed_at": now.strftime("%Y/%m/%d %H:%M"),
        }
        background_tasks.add_task(
            mailer.send_aud_email,
            user.email,
            "change_email_success.html",
            "Change email success",
            success_context,
        )

        # Alert email to old email
        if (
            user.old_email
            and user.revert_email_token
            and user.revert_email_token_expire_at
        ):
            alert_context = {
                "email_changed_at": now.strftime("%Y/%m/%d %H:%M"),
                "revert_email_url": f"{settings.WEB_URL}/email/revert/{user.revert_email_token}",
                "expire_at": user.revert_email_token_expire_at.strftime(
                    "%Y/%m/%d %H:%M"
                ),
            }
            background_tasks.add_task(
                mailer.send_aud_email,
                user.old_email,
                "alert_change_email.html",
                "Alert Change Email",
                alert_context,
            )

        # Invalidate user auth cache
        invalidate_user_auth_cache(user.id, user.email, user.role)

        return user
