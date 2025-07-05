from datetime import datetime
from typing import Optional

from sqlmodel import DateTime, Field, UniqueConstraint

from backend.models.base_model import BaseModel


class Feedback(BaseModel, table=True):
    __tablename__: str = "feedbacks"

    event_id: int = Field(foreign_key="events.id", index=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    positive_feedback: str = Field(max_length=500, nullable=True)
    negative_feedback: str = Field(max_length=500, nullable=True)
    is_anonymous: Optional[bool] = Field(default=False)

    deleted_at: Optional[datetime] = Field(
        sa_type=DateTime(timezone=True), nullable=True
    )

    __table_args__ = (
        UniqueConstraint(
            "event_id",
            "user_id",
            name="uix_event_user_feedback",
        ),
    )
