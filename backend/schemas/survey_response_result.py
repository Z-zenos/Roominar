from pydantic import BaseModel, Field

from backend.core.constants import QuestionTypeCode


class SurveyResponseResultItem(BaseModel):
    question_id: int
    answers_ids: list[int] = Field([])
    answer_text: str | None


class AttendeeSurveyResponseResultItem(BaseModel):
    question: str
    question_type: QuestionTypeCode
    answers: list[str] = Field([])
    answer_text: str | None = None
