from datetime import datetime
from typing import Optional

from sqlmodel import DateTime, Field, String, Text

from backend.models.base_model import BaseModel


class Comment(BaseModel, table=True):
    __tablename__ = "comments"

    event_id: int = Field(foreign_key="events.id", index=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    content: str = Field(sa_type=Text)
    is_pinned: bool = Field(default=False)
    deleted_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    deletion_reason: Optional[str] = Field(sa_type=String(255))

    vote_count: int = Field(default=0)
    reply_count: int = Field(default=0)
