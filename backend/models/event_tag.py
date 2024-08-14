from typing import Optional

from sqlmodel import Field

from backend.models.base_model import BaseModel


class EventTag(BaseModel, table=True):
    __tablename__: str = "event_tags"

    event_id: Optional[int] = Field(foreign_key="events.id")
    tag_id: Optional[int] = Field(foreign_key="tags.id")
