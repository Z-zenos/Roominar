from sqlmodel import Session, select

from backend.models.user import User
from backend.schemas.user import UpdateUserRequest
from backend.utils.database import transaction_scope


def update_audience(
    db: Session, current_user: User, request: UpdateUserRequest
) -> User:
    """Update audience profile with proper session management"""

    with transaction_scope() as session:
        # Get the user from the session
        user = session.exec(select(User).where(User.id == current_user.id)).first()

        if not user:
            raise ValueError("User not found")

        # Update user fields from request
        if request.full_name is not None:
            user.full_name = request.full_name
        if request.phone is not None:
            user.phone = request.phone
        if request.avatar_url is not None:
            user.avatar_url = request.avatar_url
        if request.date_of_birth is not None:
            user.date_of_birth = request.date_of_birth
        if request.gender is not None:
            user.gender = request.gender
        if request.city_code is not None:
            user.city_code = request.city_code
        if request.job_type_codes is not None:
            user.job_type_codes = request.job_type_codes
        if request.industry_codes is not None:
            user.industry_codes = request.industry_codes

        # Set updated_by to current user
        user.updated_by = current_user.id

        # Save changes
        session.add(user)
        session.commit()
        session.refresh(user)

        # Invalidate user caches
        from backend.core.simple_cache import invalidate_user_caches

        invalidate_user_caches(current_user.id)

        return user
