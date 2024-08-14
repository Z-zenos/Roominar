from typing import Optional

from sqlmodel import Field, String

from backend.models.base_model import BaseModel


class Tag(BaseModel, table=True):
    __tablename__: str = "tags"

    name: str = Field(sa_type=String(255))
    image_url: Optional[str] = Field(sa_type=String(2048))
    tag_group_id: Optional[int] = Field(foreign_key="tag_groups.id")
