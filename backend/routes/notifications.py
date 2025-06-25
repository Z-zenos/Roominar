from http import HTTPStatus

from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.services.user_notification_tokens as user_notification_tokens_service
from backend.core.constants import DeviceTypeCode
from backend.core.error_code import ErrorCode
from backend.core.exception import BadRequestException
from backend.core.rate_limiter import rate_limit
from backend.core.response import authenticated_api_responses
from backend.db.database import get_read_db
from backend.dependencies.authentication import get_current_user
from backend.models.user import User
from backend.schemas.notification import (
    RegisterNotificationDeviceTokenRequest,
    RegisterNotificationDeviceTokenResponse,
)

router = APIRouter()


@router.post(
    "/device-token",
    status_code=HTTPStatus.OK,
    responses=authenticated_api_responses,
    response_model=RegisterNotificationDeviceTokenResponse,
)
@rate_limit("USER_GENERAL")
async def register_notification_device_token(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
    request: RegisterNotificationDeviceTokenRequest = None,
):
    """Register or update a device token for push notifications"""
    user_notification_token = (
        user_notification_tokens_service.register_notification_device_token(
            db=db,
            user_id=current_user.id,
            fcm_token=request.fcm_token,
            device_type=request.device_type or DeviceTypeCode.WEB,
        )
    )

    return RegisterNotificationDeviceTokenResponse(
        id=user_notification_token.id,
        fcm_token=user_notification_token.fcm_token,
        device_type=user_notification_token.device_type,
        user_id=user_notification_token.user_id,
    )


@router.delete(
    "/device-token/{fcm_token}",
    status_code=HTTPStatus.OK,
    responses=authenticated_api_responses,
)
@rate_limit("USER_GENERAL")
async def remove_notification_device_token(
    fcm_token: str,
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
):
    """Remove a device token when logging out"""
    # Verify the token belongs to the current user for security
    tokens = user_notification_tokens_service.get_notification_device_tokens(
        db, current_user.id
    )
    if not any(token.fcm_token == fcm_token for token in tokens):
        raise BadRequestException(ErrorCode.ERR_UNAUTHORIZED)

    return user_notification_tokens_service.remove_notification_device_token(
        db, fcm_token
    )


@router.get(
    "/",
    status_code=HTTPStatus.OK,
    responses=authenticated_api_responses,
    response_model=list[dict],
)
@rate_limit("USER_GENERAL")
async def get_notifications(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
    page: int = 1,
    per_page: int = 20,
    is_read: bool = None,
):
    """Get user notifications with pagination"""
    from backend.schemas.notification import ListingNotificationsQueryParams
    from backend.services.notifications.notification_service import NotificationService

    query_params = ListingNotificationsQueryParams(
        page=page, per_page=per_page, is_read=is_read
    )

    notifications = NotificationService.listing_notifications(
        user_id=current_user.id, query_params=query_params, db=db
    )

    return notifications


@router.patch(
    "/{notification_id}/read",
    status_code=HTTPStatus.OK,
    responses=authenticated_api_responses,
)
@rate_limit("USER_GENERAL")
async def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
):
    """Mark a notification as read"""
    from backend.services.notifications.notification_service import NotificationService

    notification = NotificationService.mark_notification_as_read(
        user=current_user, notification_id=notification_id, db=db
    )

    if not notification:
        raise BadRequestException(ErrorCode.ERR_NOTIFICATION_NOT_FOUND)

    return {"message": "Notification marked as read"}


@router.get(
    "/unread-count",
    status_code=HTTPStatus.OK,
    responses=authenticated_api_responses,
    response_model=dict,
)
@rate_limit("USER_GENERAL")
async def get_unread_notification_count(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
):
    """Get count of unread notifications"""
    from backend.services.notifications.notification_service import NotificationService

    count = NotificationService.count_unread_notifications(
        user_id=current_user.id, db=db
    )

    return {"unread_count": count}
