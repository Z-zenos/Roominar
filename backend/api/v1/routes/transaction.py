from http import HTTPStatus

from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.api.v1.services.transactions as transaction_service
from backend.api.v1.dependencies.authentication import authorize_role
from backend.core.constants import RoleCode
from backend.core.response import authenticated_api_responses
from backend.db.database import get_read_db
from backend.models.user import User
from backend.schemas.application import CreateApplicationRequest

router = APIRouter()


@router.post(
    "/webhook",
    status_code=HTTPStatus.NO_CONTENT,
    responses=authenticated_api_responses,
)
async def create_application_transaction(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    request: CreateApplicationRequest = None,
):
    print(request)
    return await transaction_service.create_application_transaction(
        db, current_user, request
    )
