from sqlmodel import ARRAY, Field, Integer

from backend.models.base_model import BaseModel


class QuestionAnswerResult(BaseModel, table=True):
    __tablename__: str = "question_answer_results"

    event_id: int = Field(foreign_key="events.id")
    application_id: int = Field(foreign_key="applications.id")
    question_id: int = Field(foreign_key="questions.id")
    answers_ids: list[int] = Field(sa_type=ARRAY(Integer))
