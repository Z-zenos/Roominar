from sqlmodel import Field, String

from backend.models.base_model import BaseModel


class Answer(BaseModel, table=True):
    __tablename__: str = "answers"

    question_id: int = Field(foreign_key="questions.id")
    answer: str = Field(sa_type=String(1024))
    order_number: int
    is_correct: bool
