from typing import Optional

from sqlmodel import Field

from backend.models.base_model import BaseModel


class UserTag(BaseModel, table=True):
    __tablename__: str = "user_tags"

    user_id: Optional[int] = Field(foreign_key="users.id")
    tag_id: Optional[int] = Field(foreign_key="tags.id")
