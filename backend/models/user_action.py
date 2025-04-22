from datetime import datetime
from typing import Optional

from sqlmodel import JSON, Column, DateTime, Enum, Field, String, func

from backend.core.constants import DeviceTypeCode, UserActionTypeCode
from backend.models.base_model import BaseModel


class UserAction(BaseModel, table=True):
    __tablename__ = "user_actions"

    user_id: Optional[int] = Field(default=None, index=True)
    event_id: Optional[int] = Field(default=None, index=True)
    organization_id: Optional[int] = Field(default=None, index=True)
    action_type: UserActionTypeCode = Field(sa_type=Enum(UserActionTypeCode))
    extra_info: Optional[dict] = Field(default=None, sa_column=Column(JSON))

    ip_address: Optional[str] = Field(
        sa_type=String(45), index=True
    )  # Hashed IPv4 (15) / IPv6 (45)
    device_type: Optional[DeviceTypeCode] = Field(sa_type=Enum(DeviceTypeCode))

    action_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={
            "server_default": func.now(),
        },
        index=True,
    )
