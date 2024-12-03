from http import HTTPStatus

from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.api.v1.services.auth as auth_service
import backend.api.v1.services.events as events_service
import backend.api.v1.services.organizations as organizations_service
from backend.api.v1.dependencies.authentication import (
    authorize_role,
    get_current_user,
    get_user_if_logged_in,
)
from backend.core.constants import RoleCode
from backend.core.response import authenticated_api_responses, public_api_responses
from backend.db.database import get_read_db
from backend.models.user import User
from backend.schemas.auth import RegisterOrganizationRequest
from backend.schemas.event import (
    ListingOrganizationEventsQueryParams,
    ListingOrganizationEventsResponse,
    ListingTopOrganizationEventsResponse,
)
from backend.schemas.organization import ListingOngoingEventOrganizationsResponse

router = APIRouter()


@router.get(
    "/{organization_id}/top-events",
    response_model=ListingTopOrganizationEventsResponse,
    responses=public_api_responses,
)
async def listing_top_organization_events(
    organization_id: int = None,
    db: Session = Depends(get_read_db),
):
    events = await events_service.listing_top_organization_events(db, organization_id)
    return ListingTopOrganizationEventsResponse(events=events)


@router.post(
    "/register",
    response_model=int,
    responses=public_api_responses,
)
async def register_organization(
    db: Session = Depends(get_read_db),
    request: RegisterOrganizationRequest = None,
):
    organization_id = await auth_service.register_organization(db, request)
    return organization_id


@router.get(
    "/events",
    response_model=ListingOrganizationEventsResponse,
    responses=authenticated_api_responses,
)
async def listing_organization_events(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    query_params: ListingOrganizationEventsQueryParams = Depends(
        ListingOrganizationEventsQueryParams
    ),
):
    events, total = await events_service.listing_organization_events(
        db, organizer, query_params
    )
    return ListingOrganizationEventsResponse(
        data=events, total=total, page=1, per_page=10
    )


@router.get(
    "/ongoing-event-organizations",
    response_model=ListingOngoingEventOrganizationsResponse,
    responses=public_api_responses,
)
async def listing_organizations_of_ongoing_event(
    db: Session = Depends(get_read_db),
    user: User | None = Depends(get_user_if_logged_in),
):
    organizations = await organizations_service.listing_ongoing_event_organizations(
        db, user
    )
    return ListingOngoingEventOrganizationsResponse(
        data=organizations,
        total=len(organizations),
        page=1,
        per_page=len(organizations),
    )


@router.post(
    "/{organization_id}/follow",
    response_model=int,
    responses=authenticated_api_responses,
)
async def create_organization_follow(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
    organization_id: int = None,
):
    return await organizations_service.follow_organization(
        db, current_user, organization_id
    )


@router.delete(
    "/{organization_id}/follow",
    status_code=HTTPStatus.NO_CONTENT,
    responses=authenticated_api_responses,
)
async def delete_organization_follow(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
    organization_id: int = None,
):
    return await organizations_service.unfollow_organization(
        db, current_user, organization_id
    )
