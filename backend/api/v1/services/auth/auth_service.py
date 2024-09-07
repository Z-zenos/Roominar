from sqlmodel import Session, select

from backend.api.v1.services.auth.password_service import verify_password
from backend.models.user import User
from backend.utils.database import fetch_one


def get_user_by_email(db: Session, email: str, role_code: str) -> User | None:
    query = select(User).where(User.email == email, User.role_code == role_code)
    return fetch_one(db, query)


def authenticate_user(db: Session, **kwargs):
    user = get_user_by_email(db, kwargs.get("email"), kwargs.get("role_code"))

    if not user:
        return False

    if not verify_password(kwargs.get("password"), user.password):
        return False
    return user
