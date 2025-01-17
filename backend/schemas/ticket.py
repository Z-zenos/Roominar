from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from backend.core.constants import (
    TicketDeliveryMethodCode,
    TicketStatusCode,
    TicketTypeCode,
)


class TicketItem(BaseModel):
    id: int
    name: str
    available_quantity: int
    quantity: int
    description: Optional[str]
    price: Optional[float]
    expired_at: Optional[datetime]
    type: Optional[TicketTypeCode]
    status: Optional[TicketStatusCode]
    sales_start_at: Optional[datetime]
    sales_end_at: Optional[datetime]
    delivery_method: Optional[TicketDeliveryMethodCode]
    is_refundable: Optional[bool]


class CreateTicketRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    event_id: int | None
    name: str = Field(max_length=255)
    quantity: int = Field(ge=1)
    description: str | None
    price: float = Field(default=0, ge=0)
    expired_at: datetime | None
    type: TicketTypeCode
    delivery_method: TicketDeliveryMethodCode
    access_link_url: str | None
    is_refundable: bool | None
    sales_start_at: datetime | None
    sales_end_at: datetime | None


class OrganizationEventTicketItem(BaseModel):
    id: int
    name: str
    available_quantity: int
    quantity: int
    price: float
    type: TicketTypeCode
