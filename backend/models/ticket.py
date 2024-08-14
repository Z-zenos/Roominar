from typing import Optional

from sqlmodel import Field, Integer, String

from backend.models.base_model import BaseModel


class Ticket(BaseModel, table=True):
    __tablename__: str = "tickets"

    event_id: Optional[int] = Field(foreign_key="events.id")
    name: str = Field(sa_type=String(1024))
    quantity: int = Field(sa_type=Integer)
