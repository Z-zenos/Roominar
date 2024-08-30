from pydantic import BaseModel, Field


class QuestionAnswerResultItem(BaseModel):
    question_id: int
    answers_ids: list[int] = Field([])
