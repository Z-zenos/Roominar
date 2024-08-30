from typing import Optional

from pydantic import BaseModel, Field

from backend.schemas.question import QuestionAnswerItem


class QuestionnaireDetail(BaseModel):
    id: int
    name: Optional[str]
    question_anwers: list[QuestionAnswerItem] = Field([])
