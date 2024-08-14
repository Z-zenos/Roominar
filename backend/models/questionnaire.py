from typing import Optional

from sqlmodel import Field, String, Enum

from backend.core.constants import QuestionnaireStatusCode
from backend.models.base_model import BaseModel


class Questionnaire(BaseModel, table=True):
    __tablename__: str = "questionnaires"

    name: Optional[str] = Field(sa_type=String(255))
    status_code: Optional[QuestionnaireStatusCode] = Field(
        sa_type=Enum(QuestionnaireStatusCode)
    )
    organization_id: Optional[int] = Field(foreign_key="organizations.id")
