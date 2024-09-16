import hashlib
import secrets
import string
from datetime import datetime, timedelta, timezone
from typing import Tuple

from jose import ExpiredSignatureError, JWTError, jwt

from backend.core.config import settings
from backend.core.error_code import ErrorCode
from backend.core.exception import BadRequestException, UnauthorizedException
from backend.models.user import User


def gen_auth_token(user: User, remember_me: bool = False):
    access_token_expire_at = datetime.now() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role_code}, expire=access_token_expire_at
    )
    refresh_token, refresh_expire_at = create_refresh_token(
        {"sub": user.email, "role": user.role_code}, remember_me=remember_me
    )

    return {
        "token_type": "bearer",
        "access_token": access_token,
        "expire_at": access_token_expire_at,
        "refresh_token": refresh_token,
        "refresh_expire_at": refresh_expire_at,
    }


def create_token(token_length: int):
    characters = string.ascii_letters + string.digits
    token = "".join(secrets.choice(characters) for _ in range(token_length))
    return token


def create_email_verification_token():
    expire = datetime.now() + timedelta(
        minutes=settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES
    )
    return create_token(settings.EMAIL_VERIFICATION_TOKEN_LENGTH), expire


def create_refresh_token(data: dict, remember_me: bool) -> Tuple[str, datetime]:
    to_encode = data.copy()
    expire = datetime.now() + timedelta(
        minutes=(
            settings.REFRESH_TOKEN_REMEMBERED_EXPIRE_MINUTES
            if remember_me
            else settings.REFRESH_TOKEN_EXPIRE_MINUTES
        )
    )

    to_encode.update({"exp": expire.astimezone(timezone.utc)})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt, expire


def create_access_token(data: dict, expire: datetime):
    to_encode = data.copy()
    to_encode.update({"exp": expire.astimezone(timezone.utc)})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def verify_refresh_token(token: str):
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        if payload["exp"] < datetime.now().timestamp():
            raise UnauthorizedException(ErrorCode.ERR_TOKEN_EXPIRED)
        if not payload["sub"]:
            raise UnauthorizedException(ErrorCode.ERR_UNAUTHORIZED)
        return payload

    except ExpiredSignatureError:
        raise BadRequestException(ErrorCode.ERR_TOKEN_EXPIRED)

    except JWTError:
        raise BadRequestException(ErrorCode.ERR_INVALID_TOKEN)


def create_reset_password_token():
    expire_at = datetime.now() + timedelta(
        minutes=settings.RESET_PASSWORD_TOKEN_EXPIRE_MINUTES
    )

    reset_token = create_token(settings.RESET_PASSWORD_TOKEN_LENGTH)
    encrypted_token = hashlib.sha256(reset_token.encode("utf-8")).hexdigest()

    return reset_token, encrypted_token, expire_at


# def check_valid_token(token: str, db: Session):
#     user = db.exec(select(User).where(User.email_verify_token == token)).first()
#     if not user:
#         raise BadRequestException(
#             error_code=ErrorCode.ERR_TOKEN_INVALID,
#             message="トークンの有効期限が切れました。",
#         )

#     if user and user.email_verify_at:
#         raise BadRequestException(
#             error_code=ErrorCode.ERR_USER_ALREADY_EXISTS,
#             message="URLの有効期限が切れています。",
#         )

#     if user and user.email_verify_token_expire_at < datetime.now():
#         raise BadRequestException(
#             error_code=ErrorCode.ERR_TOKEN_EXPIRED,
#             message="URLの有効期限が切れています。",
#         )


# def get_email_by_token(token: str, db: Session):
#     user = db.exec(select(User).where(User.email_verify_token == token)).first()
#     return user.email


def create_request_change_email_token():
    expire = datetime.now() + timedelta(
        minutes=settings.VERIFY_CHANGE_EMAIL_EXPIRE_MINUTES
    )
    return create_token(settings.VERIFY_CHANGE_EMAIL_TOKEN_LENGTH), expire
