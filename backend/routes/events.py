from http import HTTPStatus

from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.services.check_in as check_in_service
import backend.services.events as events_service
import backend.services.tickets as tickets_service
from backend.core.constants import RoleCode
from backend.core.response import authenticated_api_responses, public_api_responses
from backend.db.database import get_read_db
from backend.dependencies.authentication import (
    authorize_role,
    get_current_user,
    get_user_if_logged_in,
)
from backend.models import User
from backend.schemas.check_in import ManualCheckInRequest, QRCheckInRequest
from backend.schemas.event import (
    CreateDraftEventRequest,
    GenerateEventAIRequest,
    GenerateEventAIResponse,
    GetDraftEventResponse,
    GetEventDetailResponse,
    ListingEventOptionsResponse,
    ListingEventRankResponse,
    ListingMyEventsQueryParams,
    ListingMyEventsResponse,
    ListingRecommendationEventsResponse,
    ListingRelatedEventsResponse,
    ListingTrendingEventsResponse,
    PublishEventRequest,
    SaveDraftEventRequest,
    SearchEventsQueryParams,
    SearchEventsResponse,
)
from backend.schemas.ticket import (
    ListingEventPurchasedTicketsQueryParams,
    ListingEventPurchasedTicketsResponse,
    TicketItem,
)

router = APIRouter()


@router.get(
    "",
    response_model=SearchEventsResponse,
    responses=public_api_responses,
)
async def search_events(
    db: Session = Depends(get_read_db),
    user: User | None = Depends(get_user_if_logged_in),
    query_params: SearchEventsQueryParams = Depends(SearchEventsQueryParams),
):
    events, total = await events_service.search_events(db, user, query_params)

    return SearchEventsResponse(
        page=query_params.page, per_page=query_params.per_page, total=total, data=events
    )


@router.get(
    "/trending",
    response_model=ListingTrendingEventsResponse,
    responses=public_api_responses,
)
async def listing_trending_events(
    db: Session = Depends(get_read_db),
    user: User | None = Depends(get_user_if_logged_in),
    query_params: SearchEventsQueryParams = Depends(SearchEventsQueryParams),
):
    events, total = await events_service.listing_trending_events(db, user, query_params)
    return ListingTrendingEventsResponse(
        page=query_params.page, per_page=query_params.per_page, total=total, data=events
    )


@router.get(
    "/rank",
    response_model=ListingEventRankResponse,
    responses=public_api_responses,
)
async def listing_event_rank(db: Session = Depends(get_read_db)):
    events = await events_service.listing_event_rank(db)
    return ListingEventRankResponse(events=events)


@router.get(
    "/options",
    response_model=ListingEventOptionsResponse,
    responses=authenticated_api_responses,
)
async def listing_event_options(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
):
    event_options = await events_service.listing_event_options(db, organizer)
    return ListingEventOptionsResponse(data=event_options)


@router.get(
    "/my-events",
    response_model=ListingMyEventsResponse,
    responses=authenticated_api_responses,
)
async def listing_my_events(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    query_params: ListingMyEventsQueryParams = Depends(ListingMyEventsQueryParams),
):
    events, total = await events_service.listing_my_events(
        db, current_user, query_params
    )
    return ListingMyEventsResponse(
        page=query_params.page,
        per_page=query_params.per_page,
        total=total,
        data=events,
    )


@router.get(
    "/recommendation",
    response_model=ListingRecommendationEventsResponse,
    responses=public_api_responses,
)
async def listing_recommendation_events(
    db: Session = Depends(get_read_db),
    user: User = Depends(get_current_user),
    query_params: SearchEventsQueryParams = Depends(SearchEventsQueryParams),
):
    data = await events_service.listing_recommendation_events(db, user, query_params)
    return ListingRecommendationEventsResponse(
        data=data.get("events"),
        total=data.get("total"),
        page=query_params.page,
        per_page=query_params.per_page,
    )


@router.get(
    "/draft",
    response_model=GetDraftEventResponse,
    responses=authenticated_api_responses,
)
async def get_draft_event(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
):
    return await events_service.get_draft_event(db, organizer)


@router.get(
    "/{slug}", response_model=GetEventDetailResponse, responses=public_api_responses
)
async def get_event_detail(
    db: Session = Depends(get_read_db),
    user: User | None = Depends(get_user_if_logged_in),
    slug: str = None,
):
    return await events_service.get_event_detail(db, user, slug)


@router.get(
    "/{slug}/purchased-tickets",
    response_model=ListingEventPurchasedTicketsResponse,
    responses=authenticated_api_responses,
)
async def listing_event_purchased_tickets(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    query_params: ListingEventPurchasedTicketsQueryParams = Depends(
        ListingEventPurchasedTicketsQueryParams
    ),
    slug: str = None,
):
    (
        event_purchased_tickets,
        total,
    ) = await tickets_service.listing_event_purchased_tickets(
        db, organizer, query_params, event_slug=slug
    )
    return ListingEventPurchasedTicketsResponse(
        data=event_purchased_tickets, total=total, page=1, per_page=10
    )


@router.get(
    "/{slug}/related-events",
    response_model=ListingRelatedEventsResponse,
    responses=public_api_responses,
)
async def listing_related_events(slug: str = None, db: Session = Depends(get_read_db)):
    events = await events_service.listing_related_events(db, slug)
    return ListingRelatedEventsResponse(events=events)


@router.post(
    "/{event_id}/bookmark",
    response_model=int,
    responses=authenticated_api_responses,
)
async def create_event_bookmark(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
    event_id: int = None,
):
    return await events_service.create_event_bookmark(db, current_user, event_id)


@router.delete(
    "/{event_id}/bookmark",
    status_code=HTTPStatus.NO_CONTENT,
    responses=authenticated_api_responses,
)
async def delete_event_bookmark(
    event_id: int,
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
):
    return await events_service.delete_event_bookmark(db, current_user, event_id)


@router.post("/draft", response_model=int, responses=authenticated_api_responses)
async def create_draft_event(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    request: CreateDraftEventRequest = None,
):
    return await events_service.create_draft_event(db, organizer, request)


@router.patch(
    "/draft/{event_id}", response_model=int, responses=authenticated_api_responses
)
async def save_draft_event(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    request: SaveDraftEventRequest = None,
    event_id: int = None,
):
    return await events_service.save_draft_event(db, organizer, request, event_id)


@router.post(
    "/ai/draft",
    response_model=GenerateEventAIResponse,
    responses=authenticated_api_responses,
)
async def generate_event_ai(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    request: GenerateEventAIRequest = None,
):
    return await events_service.generate_event_ai(db, organizer, request)


@router.post("/{event_id}", response_model=str, responses=authenticated_api_responses)
async def publish_event(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    request: PublishEventRequest = None,
    event_id: int = None,
):
    return await events_service.publish_event(db, organizer, request, event_id)


@router.get(
    "/{event_id}/tickets",
    response_model=list[TicketItem],
    responses=authenticated_api_responses,
)
async def listing_tickets_of_event(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(get_current_user),
    event_id: int = None,
):
    return await tickets_service.listing_tickets_of_event(db, organizer, event_id)


@router.post(
    "/{event_id}/check-in/qr",
    response_model=int,
    responses=authenticated_api_responses,
)
async def qr_check_in(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    request: QRCheckInRequest = None,
    event_id: int = None,
):
    return await check_in_service.qr_check_in(db, organizer, request, event_id)


@router.post(
    "/check-in/manual",
    response_model=int,
    responses=authenticated_api_responses,
)
async def manual_check_in(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    request: ManualCheckInRequest = None,
):
    return await check_in_service.manual_check_in(db, organizer, request)


@router.delete(
    "/check-in/manual/{check_in_id}",
    status_code=HTTPStatus.NO_CONTENT,
    responses=authenticated_api_responses,
)
async def delete_manual_check_in(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    check_in_id: int = None,
):
    return await check_in_service.delete_manual_check_in(db, organizer, check_in_id)
