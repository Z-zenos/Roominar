from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.services.applications as application_service
from backend.core.constants import RoleCode
from backend.core.response import authenticated_api_responses
from backend.db.database import get_read_db
from backend.dependencies.authentication import authorize_role
from backend.models.user import User
from backend.schemas.application import (
    CreateApplicationCheckoutSessionResponse,
    CreateApplicationRequest,
)

router = APIRouter()


@router.post(
    "/checkout-session",
    responses=authenticated_api_responses,
    response_model=CreateApplicationCheckoutSessionResponse,
)
async def create_checkout_session(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    create_application_request: CreateApplicationRequest = None,
):
    client_secret = await application_service.create_checkout_session(
        db, current_user, create_application_request
    )
    return CreateApplicationCheckoutSessionResponse(client_secret=client_secret)


@router.post(
    "/free-application",
    responses=authenticated_api_responses,
    response_model=int,
)
async def create_free_application(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    create_application_request: CreateApplicationRequest = None,
):
    return await application_service.create_free_application(
        db, current_user, create_application_request
    )
