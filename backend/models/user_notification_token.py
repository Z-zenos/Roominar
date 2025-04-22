from typing import Optional

from sqlmodel import Enum, Field, String

from backend.core.constants import DeviceTypeCode
from backend.models.base_model import BaseModel


class UserNotificationToken(BaseModel, table=True):
    __tablename__: str = "user_notification_tokens"

    user_id: int = Field(foreign_key="users.id")
    fcm_token: str = Field(unique=True, sa_type=String)
    device_type: Optional[DeviceTypeCode] = Field(
        default=DeviceTypeCode.WEB, sa_type=Enum(DeviceTypeCode)
    )
