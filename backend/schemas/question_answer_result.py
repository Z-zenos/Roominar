from pydantic import BaseModel, Field


class QuestionAnswerResult(BaseModel):
    question_id: int
    answers_ids: list[int] = Field([])
