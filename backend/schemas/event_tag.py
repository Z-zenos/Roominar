from typing import Optional

from pydantic import BaseModel


class EventTagBase(BaseModel):
    id: Optional[int]
    event_tag: Optional[int]
    tag_id: Optional[int]


class EventTagResponse(BaseModel):
    id: int | None = None
    name: str | None = None
