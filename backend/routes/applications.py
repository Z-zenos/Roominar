from http import HTTPStatus

from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.services.applications as application_service
from backend.core.constants import RoleCode
from backend.core.rate_limiter import rate_limit
from backend.core.response import authenticated_api_responses
from backend.db.database import get_read_db
from backend.dependencies.authentication import authorize_role, get_current_user
from backend.models.user import User
from backend.schemas.application import (
    CancelApplicationRequest,
    CreateApplicationCheckoutSessionRequest,
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
    response_model=CreateApplicationCheckoutSessionResponse,
    responses=authenticated_api_responses,
)
@rate_limit("CREATE_EVENT")
async def create_application_checkout_session(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    request: CreateApplicationCheckoutSessionRequest = None,
):
    checkout_session = application_service.create_application_checkout_session(
        db, current_user, request
    )
    return CreateApplicationCheckoutSessionResponse(
        checkout_session_id=checkout_session.id,
        checkout_session_url=checkout_session.url,
    )


@router.post(
    "/free-application",
    responses=authenticated_api_responses,
    response_model=str,
)
async def create_free_application(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    create_application_request: CreateApplicationRequest = None,
):
    return await application_service.create_free_application(
        db, current_user, create_application_request
    )


@router.patch(
    "/{application_id}/cancel",
    response_model=dict,
    responses=authenticated_api_responses,
)
@rate_limit("USER_GENERAL")
async def cancel_application(
    application_id: int,
    db: Session = Depends(get_read_db),
    current_user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    request: CancelApplicationRequest = None,
):
    """Cancel an event application"""
    result = application_service.cancel_application(
        db, current_user, application_id, request
    )
    return {"message": "Application cancelled successfully", "refund_info": result}


@router.get(
    "/my-applications",
    response_model=list[dict],
    responses=authenticated_api_responses,
)
@rate_limit("USER_GENERAL")
async def get_my_applications(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    page: int = 1,
    per_page: int = 20,
):
    """Get user's event applications"""
    applications = application_service.get_user_applications(
        db, current_user, page=page, per_page=per_page
    )
    return applications
