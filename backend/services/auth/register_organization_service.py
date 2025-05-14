from datetime import datetime

import pytz
from fastapi import BackgroundTasks
from slugify import slugify
from sqlmodel import Session, select

import backend.services.auth as auth_service
from backend.core.config import settings
from backend.core.constants import LoginMethodCode, OrganizationTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.organization import Organization, ORGStatusCode
from backend.models.user import RoleCode, User
from backend.schemas.auth import RegisterOrganizationRequest
from backend.services.auth.token_service import gen_encrypted_token
from backend.utils.database import save


async def register_organization(
    db: Session, worker: BackgroundTasks, request: RegisterOrganizationRequest
) -> User:
    user = db.exec(
        select(User).where(
            User.email == request.email, User.role_code == RoleCode.ORGANIZER
        )
    ).one_or_none()

    if user and user.email_verified_at:
        raise BadRequestException(
            ErrorCode.ERR_EMAIL_ALREADY_EXISTED,
            ErrorMessage.ERR_EMAIL_ALREADY_EXISTED,
        )

    verify_token, encrypted_verify_token, verify_expire_at = gen_encrypted_token(
        settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES,
        settings.EMAIL_VERIFICATION_TOKEN_LENGTH,
    )

    try:
        # If user exists but email not verified, update verification token
        if user and user.verify_email_token_expire_at > datetime.now(pytz.utc):
            user.verify_email_token = encrypted_verify_token
            user.verify_email_token_expire_at = verify_expire_at
            updated_user = save(db, user)

            context = {
                "url": f"{settings.WEB_URL}/email/verify/organization/{verify_token}",
                "expire_at": user.verify_email_token_expire_at.strftime(
                    "%Y/%m/%d %H:%M"
                ),
                "organization_name": request.name,
                "homepage_url": settings.WEB_URL,
            }

            mailer = Email()
            worker.add_task(
                mailer.send_org_email,
                request.email,
                "register_organization.html",
                "Organization Account Verification",
                context,
            )

            return updated_user

        # Create new organization and user
        organization = Organization(
            name=request.name,
            contact_email=request.email,
            status=(
                ORGStatusCode.APPROVED
                if request.type == OrganizationTypeCode.PERSONAL
                else ORGStatusCode.PENDING
            ),
            phone=request.phone,
            type=request.type if request.type else OrganizationTypeCode.BUSINESS,
            address=request.address,
            slug=slugify(request.name) if not request.slug else request.slug,
        )

        organization = save(db, organization)

        new_user = User(
            email=request.email,
            role_code=RoleCode.ORGANIZER,
            first_name=request.first_name,
            last_name=request.last_name,
            password=auth_service.get_password_hash(request.password),
            organization_id=organization.id,
            phone=request.phone,
            verify_email_token=encrypted_verify_token,
            verify_email_token_expire_at=verify_expire_at,
            login_method_code=LoginMethodCode.NORMAL,
        )

        save(db, new_user)

        context = {
            "url": f"{settings.WEB_URL}/email/verify/organization/{verify_token}",
            "expire_at": verify_expire_at.strftime("%Y/%m/%d %H:%M"),
            "organization_name": request.name,
            "homepage_url": settings.WEB_URL,
        }

        mailer = Email()
        worker.add_task(
            mailer.send_org_email,
            request.email,
            "register_organization.html",
            "Organization Account Verification",
            context,
        )

        return new_user

    except Exception as e:
        db.rollback()
        raise e
