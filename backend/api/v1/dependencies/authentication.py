from datetime import datetime
from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session

from backend.api.v1.services.auth.auth_service import get_user_by_email
from backend.core.config import settings
from backend.core.constants import RoleCode
from backend.core.error_code import ErrorCode
from backend.core.exception import AccessDeniedException, UnauthorizedException
from backend.db.database import get_read_db
from backend.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/auth/", auto_error=False)


DBDep = Annotated[Session, Depends(get_read_db)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]


def get_current_user(
    db: DBDep,
    token: TokenDep,
) -> User:
    if token:
        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )
            email = payload.get("sub")
            if (
                email is None
                or not isinstance(email, str)
                or datetime.now().timestamp() > payload.get("exp")
            ):
                raise UnauthorizedException(error_code=ErrorCode.ERR_UNAUTHORIZED)
        except JWTError:
            raise UnauthorizedException(error_code=ErrorCode.ERR_UNAUTHORIZED)
        user = get_user_by_email(db, email, payload.get("role"))
        if not user:
            raise UnauthorizedException(error_code=ErrorCode.ERR_UNAUTHORIZED)
        return user
    else:
        raise UnauthorizedException(error_code=ErrorCode.ERR_UNAUTHORIZED)


def get_user_if_logged_in(
    db: DBDep,
    token: TokenDep,
):
    if token:
        return get_current_user(db, token)

    return None


def authorize_role(role: RoleCode):
    def wrapper(current_user: User = Depends(get_current_user)):
        if current_user.role_code != role:
            raise AccessDeniedException(error_code=ErrorCode.ERR_ACCESS_DENIED)
        return current_user

    return wrapper
