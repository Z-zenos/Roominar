from datetime import datetime
from typing import Optional

from sqlmodel import DateTime, Enum, Field, Integer, String

from backend.core.constants import (
    TicketDeliveryMethodCode,
    TicketStatusCode,
    TicketTypeCode,
)
from backend.models.base_model import BaseModel


class Ticket(BaseModel, table=True):
    __tablename__: str = "tickets"

    event_id: Optional[int] = Field(foreign_key="events.id")
    name: str = Field(sa_type=String(255))
    quantity: int = Field(sa_type=Integer, default=0)
    description: Optional[str] = Field(sa_type=String(1024))
    price: Optional[float] = Field(default=0.0)
    expired_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    type: Optional[TicketTypeCode] = Field(sa_type=Enum(TicketTypeCode))
    status: Optional[TicketStatusCode] = Field(
        sa_type=Enum(TicketStatusCode), default=TicketStatusCode.AVAILABLE
    )
    sales_start_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    sales_end_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    delivery_method: Optional[TicketDeliveryMethodCode] = Field(
        sa_type=Enum(TicketDeliveryMethodCode)
    )
    access_link_url: Optional[str] = Field(sa_type=String(2048))
    is_refundable: Optional[bool]
