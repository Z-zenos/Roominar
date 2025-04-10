from typing import Optional

from sqlmodel import Field

from backend.core.constants import DeviceTypeCode
from backend.models.base_model import BaseModel


class UserNotificationToken(BaseModel, table=True):
    __tablename__: str = "user_notification_tokens"

    user_id: int = Field(foreign_key="users.id")
    fcm_token: str = Field(primary_key=True)
    device_type: Optional[DeviceTypeCode] = Field(default=DeviceTypeCode.WEB)
