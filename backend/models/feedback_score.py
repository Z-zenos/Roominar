from sqlmodel import Field, UniqueConstraint

from backend.models.base_model import BaseModel


class FeedbackScore(BaseModel, table=True):
    __tablename__: str = "feedback_scores"

    feedback_id: int = Field(foreign_key="feedback.id", index=True)
    criteria_id: int = Field(foreign_key="feedback_criteria.id", index=True)
    score: int = Field(ge=1, le=5, nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "feedback_id",
            "criteria_id",
            name="uix_feedback_criteria_score",
        ),
    )
