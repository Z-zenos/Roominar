from datetime import datetime

from fastapi import Query
from pydantic import BaseModel, Field

from backend.core.constants import DeviceTypeCode, NotificationTypeCode
from backend.schemas.common import PaginationResponse


class ListingNotificationsQueryParams(BaseModel):
    per_page: int | None = Field(Query(default=10, le=100, ge=1))
    page: int | None = Field(Query(default=1, ge=1))
    is_read: bool | None = Field(Query(default=None))


class NotificationItem(BaseModel):
    id: int
    content: str
    created_at: datetime
    is_read: bool
    type_code: NotificationTypeCode
    avatar_url: str | None = None
    sender_id: int | None = None
    action_url: str | None = None


class ListingNotificationsResponse(PaginationResponse[NotificationItem]):
    pass


class RegisterNotificationDeviceTokenRequest(BaseModel):
    fcm_token: str
    device_type: str | None = Field(default=DeviceTypeCode.WEB)
