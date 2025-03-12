from datetime import datetime
from typing import Optional

from sqlmodel import DateTime, Enum, Field, String, func

from backend.core.constants import DeviceTypeCode
from backend.models.base_model import BaseModel


class SiteVisit(BaseModel, table=True):
    __tablename__: str = "site_visits"

    organization_id: Optional[int] = Field(foreign_key="organizations.id", index=True)
    event_id: Optional[int] = Field(foreign_key="events.id", default=None, index=True)
    user_id: Optional[int] = Field(foreign_key="users.id", default=None)

    ip_address: Optional[str] = Field(
        sa_type=String(45), index=True
    )  # Hashed IPv4 (15) / IPv6 (45)
    device_type: Optional[DeviceTypeCode] = Field(sa_type=Enum(DeviceTypeCode))

    visited_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={
            "server_default": func.now(),
        },
        index=True,
    )
