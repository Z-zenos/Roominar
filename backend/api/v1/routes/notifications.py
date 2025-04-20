from http import HTTPStatus

from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.api.v1.services.user_notification_tokens as user_notification_tokens_service
from backend.api.v1.dependencies.authentication import get_current_user
from backend.core.constants import DeviceTypeCode
from backend.core.error_code import ErrorCode
from backend.core.exception import BadRequestException
from backend.core.response import authenticated_api_responses
from backend.db.database import get_read_db
from backend.models.user import User
from backend.schemas.notification import RegisterNotificationDeviceTokenRequest

router = APIRouter()


@router.post(
    "/device-token", status_code=HTTPStatus.OK, responses=authenticated_api_responses
)
async def register_notification_device_token(
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
    request: RegisterNotificationDeviceTokenRequest = None,
):
    """Register or update a device token for push notifications"""
    return await user_notification_tokens_service.register_notification_device_token(
        db=db,
        user_id=current_user.id,
        fcm_token=request.fcm_token,
        device_type=request.device_type or DeviceTypeCode.WEB,
    )


@router.delete(
    "/device-token/{fcm_token}",
    status_code=HTTPStatus.OK,
    responses=authenticated_api_responses,
)
async def remove_notification_device_token(
    fcm_token: str,
    db: Session = Depends(get_read_db),
    current_user: User = Depends(get_current_user),
):
    """Remove a device token when logging out"""
    # Verify the token belongs to the current user for security
    tokens = await user_notification_tokens_service.get_notification_device_tokens(
        db, current_user.id
    )
    if not any(token.fcm_token == fcm_token for token in tokens):
        raise BadRequestException(ErrorCode.ERR_UNAUTHORIZED)

    return await user_notification_tokens_service.remove_notification_device_token(
        db, fcm_token
    )
