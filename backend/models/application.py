from datetime import datetime
from typing import Optional

from sqlmodel import DateTime, Enum, Field, String

from backend.core.constants import ApplicationStatusCode
from backend.models.base_model import BaseModel


class Application(BaseModel, table=True):
    __tablename__: str = "applications"

    event_id: int = Field(foreign_key="events.id")
    user_id: int = Field(foreign_key="users.id")
    email: str = Field(sa_type=String(255))
    first_name: str = Field(sa_type=String(255))
    last_name: str = Field(sa_type=String(255))
    workplace_name: Optional[str] = Field(sa_type=String(255))
    phone: Optional[str] = Field(sa_type=String(20))
    ticket_id: int = Field(foreign_key="tickets.id")
    status: Optional[ApplicationStatusCode] = Field(sa_type=Enum(ApplicationStatusCode))
    canceled_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
