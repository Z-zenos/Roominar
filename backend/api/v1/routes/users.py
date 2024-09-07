from fastapi import APIRouter, Body, Depends
from sqlmodel import Session

import backend.api.v1.services.users as users_service
from backend.api.v1.dependencies.authentication import authorize_role
from backend.core.constants import RoleCode
from backend.core.response import authenticated_api_responses
from backend.db.database import get_read_db
from backend.models.user import User
from backend.schemas.auth import GetMeResponse
from backend.schemas.user import UpdateUserRequest

router = APIRouter()


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
