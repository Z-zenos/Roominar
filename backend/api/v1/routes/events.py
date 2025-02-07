from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.api.v1.services.events as events_service
import backend.api.v1.services.tickets as tickets_service
from backend.api.v1.dependencies.authentication import (
    authorize_role,
    get_current_user,
    get_user_if_logged_in,
)
from backend.core.constants import RoleCode
from backend.core.response import authenticated_api_responses, public_api_responses
from backend.db.database import get_read_db
from backend.models import User
from backend.schemas.check_in import CreateCheckInRequest
from backend.schemas.event import (
    CreateDraftEventRequest,
    GetDraftEventResponse,
    GetEventDetailResponse,
    ListingEventRankResponse,
    ListingMyEventsQueryParams,
    ListingMyEventsResponse,
    ListingRecommendationEventsResponse,
    ListingRelatedEventsResponse,
    PublishEventRequest,
    SaveDraftEventRequest,
    SearchEventsQueryParams,
    SearchEventsResponse,
)
from backend.schemas.ticket import TicketItem

router = APIRouter()


@router.get(
    "",
    response_model=SearchEventsResponse,
    responses=public_api_responses,
)
async def search_events(
    db: Annotated[Session, Depends(get_read_db)],
    user: Annotated[User | None, Depends(get_user_if_logged_in)] = None,
    query_params: Annotated[
        SearchEventsQueryParams, Depends(SearchEventsQueryParams)
    ] = None,
):
    events, total = await events_service.search_events(db, user, query_params)

    return SearchEventsResponse(
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


# @router.get(
#     "/recommend", response_model=ListingEventResponse, responses=public_api_responses
# )
# def listing_recommend_events(
#     db: Annotated[Session, Depends(get_db)],
#     user: Annotated[User | None, Depends(get_user_if_logged_in)] = None,
#     query_params: Annotated[
#         FilteringEventsQueryParams, Depends(FilteringEventsQueryParams)
#     ] = None,
# ):
#     # return empty list on unauthenticated user
#     if not user:
#         return ListingEventResponse(
#             page=query_params.page,
#             per_page=query_params.per_page,
#             total=0,
#             data=[],
#         )
#     events, total = events_service.listing_recommend_events(db, user, query_params)

#     return ListingEventResponse(
#         page=query_params.page,
#         per_page=query_params.per_page,
#         total=total,
#         data=events
#     )


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
    events = await events_service.listing_recommendation_events(db, user, query_params)
    return ListingRecommendationEventsResponse(
        data=events,
        total=0,
        page=query_params.page,
        per_page=query_params.per_page,
    )


@router.get(
    "/{slug}", response_model=GetEventDetailResponse, responses=public_api_responses
)
async def get_event_detail(
    slug: str,
    db: Session = Depends(get_read_db),
    current_user: Annotated[User | None, Depends(get_user_if_logged_in)] = None,
):
    return await events_service.get_event_detail(db, current_user, slug)


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
    event_id: int,
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
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


@router.get(
    "/draft/{slug}",
    response_model=GetDraftEventResponse,
    responses=authenticated_api_responses,
)
async def get_draft_event(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    slug: str = None,
):
    return await events_service.get_draft_event(db, organizer, slug)


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


@router.post("/{event_id}", response_model=int, responses=authenticated_api_responses)
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
    "/{event_id}/check-in",
    response_model=int,
    responses=authenticated_api_responses,
)
async def create_check_in(
    db: Session = Depends(get_read_db),
    request: CreateCheckInRequest = None,
    event_id: int = None,
):
    return await events_service.create_check_in(db, request, event_id)


@router.delete(
    "/{event_id}/check-in/{check_in_id}",
    status_code=HTTPStatus.NO_CONTENT,
    responses=authenticated_api_responses,
)
async def delete_check_in(
    db: Session = Depends(get_read_db),
    user: User = Depends(get_current_user),
    event_id: int = None,
    check_in_id: int = None,
):
    return await events_service.delete_check_in(db, user, event_id, check_in_id)
