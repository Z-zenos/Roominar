from datetime import datetime

from fastapi import BackgroundTasks
from sqlmodel import Session

from backend.core.constants import RoleCode
from backend.core.error_code import ErrorCode
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.user import User
from backend.schemas.auth import ChangePasswordRequest
from backend.services.auth.password_service import get_password_hash, verify_password
from backend.utils.database import transaction_scope


async def _send_password_change_notification(
    mailer: Email,
    user: User,
    password_changed_at: datetime,
) -> None:
    """Send password change notification email to user."""
    if user.role_code != RoleCode.AUDIENCE:
        return

    context = {
        "first_name": user.first_name,
        "password_changed_at": password_changed_at.strftime("%Y/%m/%d %H:%M"),
    }

    await mailer.send_aud_email(
        user.email,
        "update_password_success.html",
        "Updated password",
        context,
    )


def change_password(
    db: Session,
    current_user: User,
    request: ChangePasswordRequest,
    background_tasks: BackgroundTasks,
) -> User:
    """
    Change a user's password with proper validation and notification.

    Args:
        db: Database session
        current_user: Current authenticated user
        request: Change password request containing current and new password
        background_tasks: FastAPI background tasks for async operations

    Returns:
        Updated user object

    Raises:
        BadRequestException: If current password is incorrect
    """
    # Verify current password
    if not verify_password(request.current_password, current_user.password):
        raise BadRequestException(
            ErrorCode.ERR_INVALID_PASSWORD, "Your current password is incorrect."
        )

    with transaction_scope() as session:
        now = datetime.now()

        # Update password
        current_user.password = get_password_hash(request.new_password)
        current_user.password_changed_at = now
        current_user.updated_by = current_user.id

        session.add(current_user)
        session.commit()
        session.refresh(current_user)

        # Send notification in background
        mailer = Email()
        background_tasks.add_task(
            _send_password_change_notification,
            mailer,
            current_user,
            now,
        )

        return current_user
