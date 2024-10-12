from typing import Optional

from sqlmodel import ARRAY, Field, Integer, String

from backend.models.base_model import BaseModel


class SurveyResponseResult(BaseModel, table=True):
    __tablename__: str = "survey_response_results"

    event_id: int = Field(foreign_key="events.id")
    application_id: Optional[int] = Field(foreign_key="applications.id")
    email: str = Field(sa_type=String(255))
    question_id: int = Field(foreign_key="questions.id")
    answers_ids: list[int] = Field(sa_type=ARRAY(Integer))
    answer_text: Optional[str]
