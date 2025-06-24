from sqlmodel import Session, select

from backend.core.constants import RoleCode
from backend.models.organization import Organization
from backend.models.user import User
from backend.services.auth.password_service import verify_password
from backend.utils.database import fetch_one


def get_user_by_email(db: Session, email: str, role_code: RoleCode) -> User | None:
    query = (
        select(
            User.__table__.columns,
            Organization.name.label("organization_name"),
            Organization.avatar_url.label("organization_avatar_url"),
        )
        .outerjoin(Organization, Organization.id == User.organization_id)
        .where(
            User.email == email,
            User.role_code == role_code,
            User.deleted_at.is_(None),
        )
    )

    return fetch_one(db, query)


def authenticate_user(db: Session, **kwargs):
    user = get_user_by_email(db, kwargs.get("email"), kwargs.get("role_code"))

    if not user:
        return None

    if not verify_password(kwargs.get("password"), user.password):
        return None

    return user
