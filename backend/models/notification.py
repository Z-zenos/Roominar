from typing import Optional

from sqlmodel import JSON, Column, Field

from backend.models.base_model import BaseModel


class Notification(BaseModel, table=True):
    __tablename__: str = "notifications"

    sender_id: Optional[int] = Field(foreign_key="users.id")
    receiver_id: Optional[int] = Field(foreign_key="users.id")
    content: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    type_code: str
    is_read: bool = Field(default=False)
