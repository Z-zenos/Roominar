from datetime import datetime
from typing import Optional

from sqlmodel import DateTime, Enum, Field, String, Text

from backend.core.constants import SurveyStatusCode
from backend.models.base_model import BaseModel


class Survey(BaseModel, table=True):
    __tablename__: str = "surveys"

    organization_id: int = Field(foreign_key="organizations.id")
    name: str = Field(sa_type=String(255))
    description: Optional[str] = Field(sa_type=Text)
    status_code: SurveyStatusCode = Field(sa_type=Enum(SurveyStatusCode))
    start_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    end_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    max_response_number: Optional[int]
