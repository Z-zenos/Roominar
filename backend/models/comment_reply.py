from datetime import datetime
from typing import Optional

from sqlmodel import DateTime, Field, Text

from backend.models.base_model import BaseModel


class CommentReply(BaseModel, table=True):
    __tablename__ = "comment_replies"

    comment_id: int = Field(foreign_key="comments.id", index=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    content: str = Field(sa_type=Text)
    deleted_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
