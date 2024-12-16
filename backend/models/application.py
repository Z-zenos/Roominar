from typing import Optional

from sqlmodel import Enum, Field, String

from backend.core.constants import IndustryCode, JobTypeCode
from backend.models.base_model import BaseModel


class Application(BaseModel, table=True):
    __tablename__: str = "applications"

    event_id: int = Field(foreign_key="events.id")
    user_id: int = Field(foreign_key="users.id")
    email: str = Field(sa_type=String(255))
    first_name: str = Field(sa_type=String(255))
    last_name: Optional[str] = Field(sa_type=String(255))
    workplace_name: Optional[str] = Field(sa_type=String(255))
    phone: Optional[str] = Field(sa_type=String(20))
    industry_code: Optional[IndustryCode] = Field(sa_type=Enum(IndustryCode))
    job_type_code: Optional[JobTypeCode] = Field(sa_type=Enum(JobTypeCode))
