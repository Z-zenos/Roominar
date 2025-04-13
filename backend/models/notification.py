from typing import Optional

from sqlmodel import JSON, Column, Field, String

from backend.models.base_model import BaseModel


class Notification(BaseModel, table=True):
    __tablename__: str = "notifications"

    sender_id: Optional[int] = Field(foreign_key="users.id")
    receiver_id: Optional[int] = Field(foreign_key="users.id")
    content: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    type_code: str = Field(sa_type=String)
    is_read: bool = Field(default=False)
    action_url: Optional[str] = Field(sa_type=String)
