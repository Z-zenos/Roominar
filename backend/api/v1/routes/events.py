from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.api.v1.services.events as events_service
from backend.api.v1.dependencies.authentication import (
    get_current_user,
    get_user_if_logged_in,
)
from backend.core.response import authenticated_api_responses, public_api_responses
from backend.db.database import get_read_db
from backend.models import User
from backend.schemas.event import (
    GetEventDetailResponse,
    ListingEventRankResponse,
    ListingRelatedEventsResponse,
    SearchEventsQueryParams,
    SearchEventsResponse,
)

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
