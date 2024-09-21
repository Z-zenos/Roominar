from fastapi import APIRouter, Body, Depends
from sqlmodel import Session

import backend.api.v1.services.events as events_service
import backend.api.v1.services.tags as tags_service
import backend.api.v1.services.users as users_service
from backend.api.v1.dependencies.authentication import authorize_role
from backend.core.constants import RoleCode
from backend.core.response import authenticated_api_responses
from backend.db.database import get_read_db
from backend.models.user import User
from backend.schemas.auth import GetMeResponse
from backend.schemas.event import ListingMyEventsQueryParams, ListingMyEventsResponse
from backend.schemas.user import UpdateUserRequest

router = APIRouter()


@router.patch(
    "/profile", response_model=GetMeResponse, responses=authenticated_api_responses
)
async def update_audience(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    request: UpdateUserRequest = Body(...),
):
    updated_user = await users_service.update_audience(db, current_user, request)
    return GetMeResponse(
        id=updated_user.id,
        organization_id=updated_user.organization_id,
        role_code=updated_user.role_code,
        email=updated_user.email,
        first_name=updated_user.first_name,
        last_name=updated_user.last_name,
        workplace_name=updated_user.workplace_name,
        phone=updated_user.phone,
        city_code=updated_user.city_code,
        address=updated_user.address,
        industry_code=updated_user.industry_code,
        job_type_code=updated_user.job_type_code,
        avatar_url=updated_user.avatar_url,
        tags=tags_service.get_user_tags(db, current_user.id),
    )


@router.get(
    "/my-events",
    response_model=ListingMyEventsResponse,
    responses=authenticated_api_responses,
)
def listing_my_events(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    query_params: ListingMyEventsQueryParams = Depends(ListingMyEventsQueryParams),
):
    events, total = events_service.listing_my_events(db, current_user, query_params)
    return ListingMyEventsResponse(
        page=query_params.page,
        per_page=query_params.per_page,
        total=total,
        data=events,
    )
