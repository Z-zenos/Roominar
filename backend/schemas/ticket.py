from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from backend.core.constants import (
    TicketDeliveryMethodCode,
    TicketStatusCode,
    TicketTypeCode,
)


class TicketItem(BaseModel):
    id: int
    name: str
    remain: int
    quantity: int
    description: Optional[str]
    price: Optional[float]
    expired_at: Optional[datetime]
    type: Optional[TicketTypeCode]
    status: Optional[TicketStatusCode]
    sales_start_at: Optional[datetime]
    sales_end_at: Optional[datetime]
    delivery_method: Optional[TicketDeliveryMethodCode]
    access_link_url: Optional[str]
    is_refundable: Optional[bool]
