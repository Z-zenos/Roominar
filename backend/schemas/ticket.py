from datetime import datetime

from fastapi import Query
from pydantic import BaseModel, ConfigDict, Field

from backend.core.constants import (
    CancelTicketReasonCode,
    TicketCancellationPolicyCode,
    TicketDeliveryMethodCode,
    TicketStatusCode,
    TicketTypeCode,
)
from backend.schemas.common import PaginationResponse


class TicketItem(BaseModel):
    id: int
    name: str
    available_quantity: int | None = None
    sold_quantity: int | None = None
    quantity: int
    description: str | None = None
    price: float | None = None
    expired_at: datetime | None = None
    type: TicketTypeCode | None = None
    status: TicketStatusCode | None = None
    sales_start_at: datetime | None = None
    sales_end_at: datetime | None = None
    delivery_method: TicketDeliveryMethodCode | None = None
    cancellation_policy_code: TicketCancellationPolicyCode | None = None
    cancellation_policy_extra_description: str | None = None
    purchaseble: bool | None = None


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
    sales_start_at: datetime | None
    sales_end_at: datetime | None


class UpdateTicketRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(max_length=255)
    quantity: int = Field(ge=1)
    description: str | None
    price: float = Field(default=0, ge=0)
    expired_at: datetime | None
    type: TicketTypeCode
    delivery_method: TicketDeliveryMethodCode
    access_link_url: str | None
    sales_start_at: datetime | None
    sales_end_at: datetime | None


class OrganizationEventTicketItem(BaseModel):
    id: int
    name: str
    available_quantity: int
    quantity: int
    price: float
    type: TicketTypeCode


class DraftEventTicketItem(BaseModel):
    id: int
    name: str | None = None
    quantity: int | None = None
    price: float | None = None
    type: TicketTypeCode | None = None
    description: str | None = None


class CancelTicketsRequest(BaseModel):
    transaction_item_id: int
    reason: CancelTicketReasonCode | None


class ListingEventPurchasedTicketsQueryParams(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    keyword: str | None = Field(Query(None))
    is_checked_in: bool | None = Field(Query(None))
    per_page: int | None = Field(Query(default=10, le=100, ge=1))
    page: int | None = Field(Query(default=1, ge=1))


class ListingEventPurchasedTicketsItem(BaseModel):
    transaction_item_id: int
    checked_in_at: datetime | None = None
    check_in_id: int | None = None


class ListingEventPurchasedTicketsResponse(
    PaginationResponse[ListingEventPurchasedTicketsItem]
):
    pass
