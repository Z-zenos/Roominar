from http import HTTPStatus

from fastapi import APIRouter, BackgroundTasks, Depends
from fastapi.responses import StreamingResponse
from sqlmodel import Session

import backend.services.auth as auth_service
import backend.services.events as events_service
import backend.services.organizations as organizations_service
from backend.core.constants import RoleCode
from backend.core.response import authenticated_api_responses, public_api_responses
from backend.db.database import get_read_db
from backend.dependencies.authentication import (
    authorize_role,
    get_current_user,
    get_user_if_logged_in,
)
from backend.models.user import User
from backend.schemas.auth import RegisterOrganizationRequest
from backend.schemas.event import (
    ListingOrganizationEventsQueryParams,
    ListingOrganizationEventsResponse,
    ListingOrganizationEventsTimelineItem,
    ListingTopOrganizationEventsResponse,
)
from backend.schemas.organization import (
    AnalyzeEventTicketsResponse,
    DownloadAttendeesRequest,
    FilterAnalyzeEventTicketsQueryParams,
    GetAttendeeDetailResponse,
    GetOrganizationDashboardResponse,
    GetOrganizationDetailResponse,
    GetTagStatsResponse,
    GetTicketStatsQueryParams,
    GetTicketStatsResponse,
    ListingAttendeesQueryParams,
    ListingAttendeesRankingItem,
    ListingAttendeesRankingQueryParams,
    ListingAttendeesResponse,
    ListingRandomOrganizationsResponse,
    RegisterOrganizationResponse,
    TrackUserActionsQueryParams,
    TrackUserActionsResponse,
)

router = APIRouter()


@router.post(
    "/register",
    response_model=RegisterOrganizationResponse,
    responses=public_api_responses,
)
async def register_organization(
    db: Session = Depends(get_read_db),
    worker: BackgroundTasks = None,
    request: RegisterOrganizationRequest = None,
):
    new_user = await auth_service.register_organization(db, worker, request)
    return RegisterOrganizationResponse(
        email=new_user.email, expire_at=new_user.verify_email_token_expire_at
    )


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
    "/events/{slug}/analyze/tickets",
    response_model=AnalyzeEventTicketsResponse,
    responses=authenticated_api_responses,
)
async def analyze_event_tickets(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    slug: str = None,
    query_params: FilterAnalyzeEventTicketsQueryParams = Depends(
        FilterAnalyzeEventTicketsQueryParams
    ),
):
    return await organizations_service.analyze_event_tickets(
        db, organizer, slug, query_params
    )


@router.get(
    "/dashboard",
    response_model=GetOrganizationDashboardResponse,
    responses=authenticated_api_responses,
)
async def get_organization_dashboard(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
):
    return await organizations_service.get_organization_dashboard(db, organizer)


@router.get(
    "/tag-stats",
    response_model=GetTagStatsResponse,
    responses=authenticated_api_responses,
)
async def get_tag_stats(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
):
    tag_stats = await organizations_service.get_tag_stats(db, organizer)
    return GetTagStatsResponse(data=tag_stats)


@router.get(
    "/ticket-stats",
    response_model=GetTicketStatsResponse,
    responses=authenticated_api_responses,
)
async def get_ticket_stats(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    query_params: GetTicketStatsQueryParams = Depends(GetTicketStatsQueryParams),
):
    return await organizations_service.get_ticket_stats(db, organizer, query_params)


@router.get(
    "/tracking/user-actions",
    response_model=TrackUserActionsResponse,
    responses=authenticated_api_responses,
)
async def track_user_actions(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    query_params: TrackUserActionsQueryParams = Depends(TrackUserActionsQueryParams),
):
    user_actions = await organizations_service.track_user_actions(
        db, organizer, query_params
    )
    return TrackUserActionsResponse(data=user_actions)


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
    "/attendees/ranking",
    response_model=list[ListingAttendeesRankingItem],
    responses=authenticated_api_responses,
)
async def listing_attendees_ranking(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    query_params: ListingAttendeesRankingQueryParams = Depends(
        ListingAttendeesRankingQueryParams
    ),
):
    attendees = await organizations_service.listing_attendees_ranking(
        db, organizer, query_params
    )
    return attendees


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
