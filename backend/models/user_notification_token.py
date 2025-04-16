from typing import Optional

from sqlmodel import Field, String

from backend.core.constants import DeviceTypeCode
from backend.models.base_model import BaseModel


class UserNotificationToken(BaseModel, table=True):
    __tablename__: str = "user_notification_tokens"

    user_id: int = Field(foreign_key="users.id")
    fcm_token: str = Field(primary_key=True, sa_type=String)
    device_type: Optional[str] = Field(default=DeviceTypeCode.WEB, sa_type=String)
