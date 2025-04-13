import asyncio

from fastapi import APIRouter, Body, Depends
from sqlmodel import Session

import backend.api.v1.services.tags as tags_service
import backend.api.v1.services.users as users_service
from backend.api.v1.dependencies.authentication import authorize_role
from backend.api.v1.services.notifications.notification_service import (
    NotificationService,
)
from backend.core.constants import RoleCode, TagAssociationEntityCode
from backend.core.response import authenticated_api_responses
from backend.db.database import get_read_db
from backend.models.user import User
from backend.schemas.auth import GetMeResponse
from backend.schemas.notification import (
    ListingNotificationsQueryParams,
    ListingNotificationsResponse,
)
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
        tags=tags_service.get_tag_association(
            db, current_user.id, TagAssociationEntityCode.USER
        ),
    )


@router.get(
    "/notifications",
    response_model=ListingNotificationsResponse,
    responses=authenticated_api_responses,
)
async def listing_notifications(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    query_params: ListingNotificationsQueryParams = Depends(
        ListingNotificationsQueryParams
    ),
):
    notifications, total = await asyncio.gather(
        NotificationService.listing_notifications(
            db=db,
            query_params=query_params,
            user_id=current_user.id,
        ),
        NotificationService.count_notifications(db=db, user_id=current_user.id),
    )

    return ListingNotificationsResponse(
        data=notifications,
        total=total,
        page=query_params.page,
        per_page=query_params.per_page,
    )


@router.get(
    "/total-unread-notifications",
    response_model=int,
    responses=authenticated_api_responses,
)
async def get_total_unread_notifications(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
):
    return await NotificationService.count_unread_notifications(
        db=db,
        user_id=current_user.id,
    )
