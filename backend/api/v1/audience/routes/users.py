from fastapi import APIRouter, Body, Depends, Path
from sqlmodel import Session

import backend.api.v1.audience.services.users as users_service
from backend.api.v1.dependencies.authentication import authorize_role
from backend.core.constants import RoleCode
from backend.core.response import authenticated_api_responses, public_api_responses
from backend.db.database import get_read_db
from backend.models.user import User
from backend.schemas.auth import GetMeResponse
from backend.schemas.user import (
    RegisterAudienceRequest,
    RegisterAudienceResponse,
    UpdateUserRequest,
    VerifyAudienceRequest,
    VerifyAudienceResponse,
)

router = APIRouter()


@router.post(
    "/register", response_model=RegisterAudienceResponse, responses=public_api_responses
)
async def register_audience(
    db: Session = Depends(get_read_db),
    request: RegisterAudienceRequest = None,
):
    new_user = await users_service.register_audience(db, request)
    return RegisterAudienceResponse(
        email=new_user.email, expire_at=new_user.email_verify_token_expire_at
    )


@router.get(
    "/verify/{token}",
    response_model=VerifyAudienceResponse,
    responses=public_api_responses,
)
async def verify_audience(
    db: Session = Depends(get_read_db),
    request: VerifyAudienceRequest = None,
    token: str = Path(..., description="Email Verify Token"),
):
    id = await users_service.verify_audience(db, request, token)
    return VerifyAudienceResponse(id)


@router.patch(
    "/{user_id}", response_model=GetMeResponse, responses=authenticated_api_responses
)
def update_audience(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    request: UpdateUserRequest = Body(...),
    user_id: int = None,
):
    return users_service.update_audience(db, current_user, request, user_id)
