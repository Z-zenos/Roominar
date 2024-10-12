from sqlmodel import Enum, Field, String

from backend.core.constants import QuestionTypeCode
from backend.models.base_model import BaseModel


class Question(BaseModel, table=True):
    __tablename__: str = "questions"

    survey_id: int = Field(foreign_key="surveys.id")
    type_code: QuestionTypeCode = Field(sa_type=Enum(QuestionTypeCode))
    question: str = Field(sa_type=String(1024))
    order_number: int
