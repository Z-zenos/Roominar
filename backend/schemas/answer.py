from pydantic import BaseModel


class AnswerItem(BaseModel):
    id: int
    question_id: int
    answer: str
    order_number: int
