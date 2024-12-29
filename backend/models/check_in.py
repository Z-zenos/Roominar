from datetime import datetime
from typing import Optional

from sqlmodel import DateTime, Enum, Field, String

from backend.core.constants import CheckInMethodCode
from backend.models.base_model import BaseModel


class CheckIn(BaseModel, table=True):
    __tablename__: str = "check_ins"

    event_id: int = Field(foreign_key="events.id")
    ticket_id: int = Field(foreign_key="tickets.id")
    application_id: Optional[int] = Field(foreign_key="applications.id")
    transaction_item_id: Optional[int] = Field(foreign_key="transaction_items.id")
    # checkin_at = created_at
    checkout_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    checkin_method_code: CheckInMethodCode = Field(sa_type=Enum(CheckInMethodCode))
    note: Optional[str] = Field(sa_type=String(255))
