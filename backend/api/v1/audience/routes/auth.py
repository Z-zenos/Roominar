from datetime import datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.api.v1.audience.services.auth as auth_service
from backend.api.v1.dependencies.authentication import get_user_if_logged_in
from backend.core.config import settings
from backend.core.error_code import ErrorCode
from backend.core.exception import BadRequestException, UnauthorizedException
from backend.core.response import authenticated_api_responses, public_api_responses
from backend.db.database import get_read_db
from backend.models.user import User
from backend.schemas.auth import (
    GetMeResponse,
    TokenResponse,
    UserLoginRequest,
)

router = APIRouter()


@router.post("/login", responses=public_api_responses)
async def login(
    request: UserLoginRequest,
    db: Session = Depends(get_read_db),
) -> TokenResponse:
    user = auth_service.authenticate_user(db, **request.model_dump())
    if not user:
        raise UnauthorizedException(ErrorCode.ERR_UNAUTHORIZED)
    if not user.email_verify_at:
        raise BadRequestException(ErrorCode.ERR_USER_NOT_VERIFIED)
    access_token_expires = datetime.now() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    access_token = auth_service.create_access_token(
        data={"sub": user.email, "role": user.role_code}, expire=access_token_expires
    )
    refresh_token, refresh_expire_at = auth_service.create_refresh_token(
        {"sub": user.email, "role": user.role_code}, remember_me=request.remember_me
    )
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expire_at=access_token_expires,
        refresh_token=refresh_token,
        refresh_expire_at=refresh_expire_at,
    )


@router.get("/me", response_model=GetMeResponse, responses=authenticated_api_responses)
async def me(
    current_user: Annotated[User, Depends(get_user_if_logged_in)],
    db: Session = Depends(get_read_db),
):
    return (
        GetMeResponse()
        if not current_user
        else GetMeResponse(
            id=current_user.id,
            organization_id=current_user.organization_id,
            role_code=current_user.role_code,
            email=current_user.email,
            first_name=current_user.first_name,
            last_name=current_user.last_name,
            workplace_name=current_user.workplace_name,
            phone=current_user.phone,
            city_code=current_user.city_code,
            address=current_user.address,
            industry_code=current_user.industry_code,
            job_type_code=current_user.job_type_code,
            avatar_url=current_user.avatar_url,
            # tags=user_service.get_user_tags(db, current_user),
        )
    )


@router.get("/refresh-token/{token}", responses=public_api_responses)
async def refresh_token(
    token: str,
    db: Session = Depends(get_read_db),
) -> TokenResponse:
    payload = auth_service.verify_refresh_token(token)

    user = auth_service.get_user_by_email(db, payload["sub"], payload["role"])
    if not user:
        raise UnauthorizedException(ErrorCode.ERR_UNAUTHORIZED)

    access_token_expires = datetime.now() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    access_token = auth_service.create_access_token(
        data={"sub": user.email, "role": user.role_code}, expire=access_token_expires
    )

    new_refresh_token, refresh_expire_at = auth_service.create_refresh_token(
        {"sub": user.email, "role": user.role_code}, remember_me=True
    )
    return TokenResponse(
        token_type="bearer",
        access_token=access_token,
        expire_at=access_token_expires,
        refresh_token=new_refresh_token,
        refresh_expire_at=refresh_expire_at,
    )


# @router.post(
#     "/forgot-password",
#     response_model=ForgotPasswordResponse,
#     responses=public_api_responses,
# )
#     async def forgot_password(
#         db: Annotated[Session, Depends(get_db)],
#         request: Annotated[
#             ForgotPasswordRequest,
#             Body(
#                 title="Recovery password - Step 1: Forgot Password",
#                 description="Provide user email",
#             ),
#         ],
#     ):
#     return await auth_service.forgot_password(db, request)


# @router.post(
#     "/reset-password/{reset_token}",
#     response_model=ResetPasswordResponse,
#     responses=public_api_responses,
# )
# async def reset_password(
#     db: Annotated[Session, Depends(get_db)],
#     request: Annotated[
#         ResetPasswordRequest,
#         Body(
#             title="Recovery password - Step 2: Reset Password",
#             description="Provide new password and confirm password.",
#         ),
#     ],
#     reset_token: Annotated[str, Path(description="Token recovery password")],
# ):
#     await auth_service.reset_password(db, request, reset_token)
#     return ResetPasswordResponse(status="success", message="パスワードの再設定が完了しました。")


# @router.get(
#     "/reset-password/check-token/{reset_token}",
#     responses=public_api_responses,
#     response_model=ResetPasswordTokenResponse,
# )
# async def check_reset_password_token(
#     db: Annotated[Session, Depends(get_db)],
#     reset_token: Annotated[str, Path(description="Token recovery password")],
# ):
#     return auth_service.check_valid_reset_password_token(db, reset_token)
