import asyncio

from fastapi import APIRouter, Body, Depends
from sqlmodel import Session

import backend.services.tags as tags_service
import backend.services.users as users_service
from backend.core.constants import RoleCode, TagAssociationEntityCode
from backend.core.rate_limiter import rate_limit
from backend.core.response import authenticated_api_responses
from backend.db.database import get_read_db
from backend.dependencies.authentication import authorize_role, get_current_user
from backend.models.user import User
from backend.schemas.auth import GetMeResponse
from backend.schemas.notification import (
    ListingNotificationsQueryParams,
    ListingNotificationsResponse,
)
from backend.schemas.user import UpdateUserRequest
from backend.services.notifications.notification_service import NotificationService

router = APIRouter()


@router.patch(
    "/update",
    response_model=User,
    responses=authenticated_api_responses,
)
@rate_limit("USER_GENERAL")
async def update_user(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
    request: UpdateUserRequest = Body(...),
):
    return users_service.update_audience(db, current_user, request)


@router.get(
    "/me",
    response_model=User,
    responses=authenticated_api_responses,
)
@rate_limit("USER_GENERAL")
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.get(
    "/profile",
    response_model=dict,
    responses=authenticated_api_responses,
)
@rate_limit("USER_GENERAL")
async def get_user_profile(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
):
    """Get comprehensive user profile information"""
    # This would typically include user stats, events, etc.
    return {
        "user": current_user,
        "stats": {
            "events_attended": 0,
            "events_bookmarked": 0,
            "organizations_followed": 0,
        },
    }


@router.delete(
    "/account",
    response_model=dict,
    responses=authenticated_api_responses,
)
@rate_limit("USER_GENERAL")
async def delete_user_account(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
):
    """Delete user account (placeholder - implement account deletion logic)"""
    return {"message": "Account deletion requested"}


@router.get(
    "/notifications/preferences",
    response_model=dict,
    responses=authenticated_api_responses,
)
@rate_limit("USER_GENERAL")
async def get_notification_preferences(
    current_user: User = Depends(get_current_user),
):
    """Get user notification preferences"""
    return {
        "email_notifications": True,
        "push_notifications": True,
        "sms_notifications": False,
    }


@router.patch(
    "/notifications/preferences",
    response_model=dict,
    responses=authenticated_api_responses,
)
@rate_limit("USER_GENERAL")
async def update_notification_preferences(
    preferences: dict = Body(...),
    current_user: User = Depends(get_current_user),
):
    """Update user notification preferences"""
    return {"message": "Notification preferences updated", "preferences": preferences}


@router.get(
    "/notifications",
    response_model=ListingNotificationsResponse,
    responses=authenticated_api_responses,
)
async def listing_notifications(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
):
    return await NotificationService.count_unread_notifications(
        db=db,
        user_id=current_user.id,
    )


@router.patch(
    "/notifications/{notification_id}/read",
    response_model=int,
    responses=authenticated_api_responses,
)
async def mark_notification_as_read(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
    notification_id: int = None,
):
    return await NotificationService.mark_notification_as_read(
        db, current_user, notification_id
    )
