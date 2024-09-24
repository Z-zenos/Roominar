from sqlmodel import Session, select

import backend.api.v1.services.auth as auth_service
from backend.core.config import settings
from backend.core.constants import OrganizationTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.organization import Organization, ORGStatusCode
from backend.models.user import RoleCode, User
from backend.schemas.auth import RegisterOrganizationRequest
from backend.utils.database import save


async def register_organization(
    db: Session, request: RegisterOrganizationRequest
) -> int:
    user = db.exec(
        select(User).where(
            (User.email == request.email) & (User.role_code == RoleCode.ORGANIZER)
        )
    ).one_or_none()

    if user:
        raise BadRequestException(
            ErrorCode.ERR_EMAIL_ALREADY_EXISTED,
            ErrorMessage.ERR_EMAIL_ALREADY_EXISTED,
        )

    try:
        organization = Organization(
            name=request.name,
            hp_url=request.hp_url,
            contact_url=request.contact_url,
            contact_email=request.contact_email,
            status=(
                ORGStatusCode.APPROVED
                if request.type == OrganizationTypeCode.PERSONAL
                else ORGStatusCode.PENDING
            ),
            phone=request.phone,
            city_code=request.city_code,
            type=request.type,
            address=request.address,
            representative_url=request.representative_url,
        )

        save(db, organization)

        user = User(
            email=request.email,
            role_code=RoleCode.ORGANIZER,
            first_name=request.first_name,
            last_name=request.last_name,
            password=auth_service.get_password_hash(request.password),
            organization_id=organization.id,
            phone=request.phone,
        )

        save(db, user)
    except Exception as e:
        db.rollback()
        if organization:
            db.delete(organization)
            db.commit()
        raise e

    # TODO: change context
    organization_context = {
        "hp_url": organization.hp_url,
        "contact_url": organization.contact_url,
        "contact_email": organization.contact_email,
        "name": organization.name,
        "registrar_name": f"{user.first_name} {user.last_name}",
        "registrar_email": user.email,
        "registrar_phone": user.phone,
    }
    admin_context = {
        "display_name": user.first_name,
        "email": user.email,
        "company_name": organization.name,
        "phone": user.phone,
    }

    mailer = Email()
    await mailer.send_aud_email(
        user.email,
        "organization_register_first_step.html",
        "Register Organization Success",
        organization_context,
    )

    await mailer.send_aud_email(
        settings.EMAIL_ADMIN,
        "organization_registration_success_admin_template.html",
        "Register Organization",
        admin_context,
    )

    return organization.id
