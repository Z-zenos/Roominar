from datetime import datetime
from typing import Optional

from sqlmodel import DateTime, Enum, Field, String, UniqueConstraint

from backend.core.constants import CheckInMethodCode
from backend.models.base_model import BaseModel


class CheckIn(BaseModel, table=True):
    __tablename__: str = "check_ins"

    event_id: int = Field(foreign_key="events.id")
    ticket_id: Optional[int] = Field(foreign_key="tickets.id")
    application_id: Optional[int] = Field(foreign_key="applications.id")
    transaction_item_id: Optional[int] = Field(foreign_key="transaction_items.id")
    checkout_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    checkin_method_code: CheckInMethodCode = Field(sa_type=Enum(CheckInMethodCode))
    note: Optional[str] = Field(sa_type=String(255))

    __table_args__ = (
        UniqueConstraint(
            "event_id",
            "transaction_item_id",
            name="uix_event_transaction_item_checkin",
        ),
    )
