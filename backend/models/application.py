from datetime import datetime
from typing import Optional

from sqlmodel import Field, DateTime, String, Enum

from backend.core.constants import IndustryCode, JobTypeCode
from backend.models.base_model import BaseModel


class Application(BaseModel, table=True):
    __tablename__: str = "applications"

    event_id: int = Field(foreign_key="events.id")
    event_name: str = Field(sa_type=String(1024))
    user_id: int = Field(foreign_key="users.id")
    email: str = Field(sa_type=String(255))
    first_name: str = Field(sa_type=String(255))
    last_name: str = Field(sa_type=String(255))
    workplace_name: Optional[str] = Field(sa_type=String(255))
    phone: Optional[str] = Field(sa_type=String(20))
    industry_code: Optional[IndustryCode] = Field(sa_type=Enum(IndustryCode))
    job_type_code: Optional[JobTypeCode] = Field(sa_type=Enum(JobTypeCode))
    ticket_id: int = Field(foreign_key="tickets.id")
    deleted_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    display_id: str = Field(sa_type=String(20))
