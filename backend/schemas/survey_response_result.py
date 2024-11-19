from pydantic import BaseModel, Field


class SurveyResponseResultItem(BaseModel):
    question_id: int
    answers_ids: list[int] = Field([])
    answer_text: str | None
