from sqlmodel import Session, select

from backend.core.constants import RoleCode
from backend.core.simple_cache import CacheKeys, cached_response
from backend.models.organization import Organization
from backend.models.user import User
from backend.services.auth.password_service import verify_password
from backend.utils.database import transaction_scope


@cached_response(
    cache_key="auth:user_by_email",
    ttl=300,  # 5 minutes for auth data
    include_params=True,
)
def get_user_by_email(db: Session, email: str, role_code: RoleCode) -> User | None:
    """Get user by email and role with caching"""

    with transaction_scope() as session:
        result = session.exec(
            select(
                User.id,
                User.email,
                User.password,
                User.role_code,
                User.first_name,
                User.last_name,
                User.organization_id,
                User.email_verified_at,
                User.deleted_at,
                Organization.name.label("organization_name"),
                Organization.avatar_url.label("organization_avatar_url"),
            )
            .outerjoin(Organization, Organization.id == User.organization_id)
            .where(
                User.email == email,
                User.role_code == role_code,
                User.deleted_at.is_(None),
            )
        ).first()

        return result


def authenticate_user(db: Session, **kwargs) -> User | None:
    """Authenticate user with email and password"""

    email = kwargs.get("email")
    password = kwargs.get("password")
    role_code = kwargs.get("role_code")

    if not email or not password or not role_code:
        return None

    # Get user with caching
    user = get_user_by_email(db, email, role_code)

    if not user:
        return None

    # Verify password
    if not verify_password(password, user.password):
        return None

    return user


@cached_response(
    cache_key="auth:user_by_id",
    ttl=600,  # 10 minutes for user data
    include_params=True,
)
def get_user_by_id(db: Session, user_id: int) -> User | None:
    """Get user by ID with caching"""

    with transaction_scope() as session:
        user = session.exec(
            select(
                User.id,
                User.email,
                User.role_code,
                User.first_name,
                User.last_name,
                User.organization_id,
                User.email_verified_at,
                User.deleted_at,
                User.avatar_url,
                User.phone,
                User.city_code,
                User.industry_codes,
                User.job_type_codes,
                Organization.name.label("organization_name"),
                Organization.avatar_url.label("organization_avatar_url"),
            )
            .outerjoin(Organization, Organization.id == User.organization_id)
            .where(
                User.id == user_id,
                User.deleted_at.is_(None),
            )
        ).first()

        return user


def invalidate_user_auth_cache(user_id: int, email: str, role_code: RoleCode):
    """Invalidate authentication-related caches for a user"""
    from backend.core.simple_cache import cache_client, invalidate_user_caches

    # Invalidate user-specific caches
    invalidate_user_caches(user_id)

    # Invalidate specific auth caches
    cache_patterns = [
        f"auth:user_by_email:*{email}*{role_code}*",
        f"auth:user_by_id:*{user_id}*",
    ]

    for pattern in cache_patterns:
        if cache_client:
            for key in cache_client.scan_iter(match=pattern):
                cache_client.delete(key)
