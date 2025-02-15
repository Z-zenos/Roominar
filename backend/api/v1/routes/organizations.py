from http import HTTPStatus

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
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
    ListingOrganizationEventsTimelineItem,
    ListingTopOrganizationEventsResponse,
)
from backend.schemas.organization import (
    DownloadAttendeesRequest,
    GetAttendeeDetailResponse,
    GetOrganizationDetailResponse,
    ListingAttendeesQueryParams,
    ListingAttendeesResponse,
    ListingRandomOrganizationsResponse,
)

router = APIRouter()


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
    "/events/timeline",
    response_model=list[ListingOrganizationEventsTimelineItem],
    responses=authenticated_api_responses,
)
async def listing_organization_events_timeline(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
):
    events = await events_service.listing_events_timeline(db, organizer)
    return events


@router.get(
    "/attendees",
    response_model=ListingAttendeesResponse,
    responses=authenticated_api_responses,
)
async def listing_attendees(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    query_params: ListingAttendeesQueryParams = Depends(ListingAttendeesQueryParams),
):
    attendees, total = await organizations_service.listing_attendees(
        db, organizer, query_params
    )
    return ListingAttendeesResponse(data=attendees, total=total, page=1, per_page=10)


@router.get(
    "/attendees/csv",
    response_class=StreamingResponse,
    responses={
        200: {
            "content": {"text/csv": {}},
            "description": "Stream plain text using utf8 charset.",
        },
        **authenticated_api_responses,
    },
)
async def download_attendees_csv(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    request: DownloadAttendeesRequest = Depends(DownloadAttendeesRequest),
):
    stream = await organizations_service.download_attendees_csv(db, organizer, request)

    response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=attendees.csv"
    return response


@router.get(
    "/attendees/{attendee_id}",
    response_model=GetAttendeeDetailResponse,
    responses=authenticated_api_responses,
)
async def get_attendee_detail(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    attendee_id: int = None,
):
    return await organizations_service.get_attendee_detail(db, organizer, attendee_id)


@router.get(
    "/random",
    response_model=ListingRandomOrganizationsResponse,
    responses=public_api_responses,
)
async def listing_random_organizations(
    db: Session = Depends(get_read_db),
    user: User | None = Depends(get_user_if_logged_in),
):
    organizations = await organizations_service.listing_random_organizations(db, user)
    return ListingRandomOrganizationsResponse(
        data=organizations,
        total=5,
        page=1,
        per_page=5,
    )


@router.get(
    "/{organization_slug}",
    response_model=GetOrganizationDetailResponse,
    responses=public_api_responses,
)
async def get_organization_detail(
    db: Session = Depends(get_read_db),
    user: User | None = Depends(get_user_if_logged_in),
    organization_slug: str = None,
):
    organization = await organizations_service.get_organization_detail(
        db, user, organization_slug
    )
    return organization


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
