from sqlmodel import Field

from backend.models.base_model import BaseModel


class FeedbackCriteria(BaseModel, table=True):
    __tablename__: str = "feedback_criteria"

    event_id: int = Field(foreign_key="events.id", index=True)
    name: str = Field(max_length=100, nullable=False)
