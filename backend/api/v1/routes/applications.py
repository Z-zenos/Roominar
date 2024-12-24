from http import HTTPStatus

from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.api.v1.services.applications as application_service
from backend.api.v1.dependencies.authentication import authorize_role, get_current_user
from backend.core.constants import RoleCode
from backend.core.response import authenticated_api_responses
from backend.db.database import get_read_db
from backend.models.user import User
from backend.schemas.application import (
    CreateApplicationCheckoutSessionResponse,
    CreateApplicationRequest,
)

router = APIRouter()


@router.delete(
    "/{application_id}",
    status_code=HTTPStatus.NO_CONTENT,
    responses=authenticated_api_responses,
)
async def cancel_application(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
    application_id: int = None,
):
    return await application_service.cancel_application(
        db, current_user, application_id
    )


@router.post(
    "/checkout-session",
    responses=authenticated_api_responses,
    response_model=CreateApplicationCheckoutSessionResponse,
)
async def create_application_checkout_session(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    create_application_request: CreateApplicationRequest = None,
):
    client_secret = await application_service.create_application_checkout_session(
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
