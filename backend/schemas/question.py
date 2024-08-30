from pydantic import BaseModel, Field

from backend.core.constants import QuestionTypeCode
from backend.schemas.answer import AnswerItem


class QuestionItem(BaseModel):
    id: int
    questionnaire_id: int
    type_code: QuestionTypeCode
    question: str
    order_number: int


class QuestionAnswerItem(QuestionItem):
    answers: list[AnswerItem] = Field([])
