from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.api.v1.audience.services.users as users_service
from backend.core.response import public_api_responses
from backend.db.database import get_read_db
from backend.schemas.user import RegisterAudienceRequest, RegisterAudienceResponse

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
