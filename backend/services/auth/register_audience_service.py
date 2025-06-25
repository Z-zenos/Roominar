from datetime import datetime

import pytz
from fastapi import BackgroundTasks
from sqlmodel import Session, select

import backend.services.auth as auth_service
from backend.core.config import settings
from backend.core.constants import LoginMethodCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.user import RoleCode, User
from backend.schemas.auth import RegisterAudienceRequest
from backend.services.auth.token_service import gen_encrypted_token
from backend.utils.database import transaction_scope


def register_audience(
    db: Session, worker: BackgroundTasks, request: RegisterAudienceRequest
) -> User:
    """Register a new audience user with proper session management"""

    email = request.email

    with transaction_scope() as session:
        try:
            # Check if user already exists
            existing_user = session.exec(
                select(User).where(
                    User.email == email, User.role_code == RoleCode.AUDIENCE
                )
            ).first()

            if existing_user and existing_user.email_verified_at:
                raise BadRequestException(
                    ErrorCode.ERR_USER_ALREADY_EXISTED,
                    ErrorMessage.ERR_USER_ALREADY_EXISTED,
                )

            # Generate verification token
            (
                verify_token,
                encrypted_verify_token,
                verify_expire_at,
            ) = gen_encrypted_token(
                settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES,
                settings.EMAIL_VERIFICATION_TOKEN_LENGTH,
            )

            # Handle existing unverified user
            if (
                existing_user
                and existing_user.verify_email_token_expire_at > datetime.now(pytz.utc)
            ):
                existing_user.verify_email_token = encrypted_verify_token
                existing_user.verify_email_token_expire_at = verify_expire_at
                existing_user.updated_by = existing_user.id

                session.add(existing_user)
                session.commit()
                session.refresh(existing_user)

                # Prepare email context
                context = {
                    "url": f"{settings.WEB_URL}/email/verify/{verify_token}",
                    "expire_at": existing_user.verify_email_token_expire_at.strftime(
                        "%Y/%m/%d %H:%M"
                    ),
                    "first_name": existing_user.first_name,
                }

                # Send verification email via background task
                mailer = Email()
                worker.add_task(
                    mailer.send_aud_email,
                    email,
                    "register_audience.html",
                    "Account Verification",
                    context,
                )

                # Invalidate auth caches
                auth_service.invalidate_user_auth_cache(
                    existing_user.id, email, RoleCode.AUDIENCE
                )

                return existing_user

            # Create new user
            new_user = User(
                email=email,
                verify_email_token=encrypted_verify_token,
                verify_email_token_expire_at=verify_expire_at,
                role_code=RoleCode.AUDIENCE,
                password=auth_service.get_password_hash(request.password),
                first_name=request.first_name,
                last_name=request.last_name,
                login_method_code=LoginMethodCode.NORMAL,
                created_by=None,  # Self-registration
                updated_by=None,
            )

            session.add(new_user)
            session.commit()
            session.refresh(new_user)

            # Prepare email context
            context = {
                "url": f"{settings.WEB_URL}/email/verify/{verify_token}",
                "expire_at": verify_expire_at.strftime("%Y/%m/%d %H:%M"),
                "first_name": new_user.first_name,
            }

            # Send verification email via background task
            mailer = Email()
            worker.add_task(
                mailer.send_aud_email,
                email,
                "register_audience.html",
                "Account Verification",
                context,
            )

            # Invalidate auth caches (for consistency)
            auth_service.invalidate_user_auth_cache(
                new_user.id, email, RoleCode.AUDIENCE
            )

            return new_user

        except BadRequestException:
            raise
        except Exception as e:
            raise BadRequestException(
                ErrorCode.ERR_INTERNAL_SERVER_ERROR, f"Registration failed: {str(e)}"
            )
