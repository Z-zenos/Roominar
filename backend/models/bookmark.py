from typing import Optional

from sqlmodel import Field

from backend.models.base_model import BaseModel


class Bookmark(BaseModel, table=True):
    __tablename__: str = "bookmarks"

    event_id: int = Field(foreign_key="events.id")
    user_id: int = Field(foreign_key="users.id")
