from datetime import datetime
from typing import Optional

from fastapi import Query
from pydantic import BaseModel, ConfigDict, Field

from backend.core.constants import (
    CancelTicketReasonCode,
    CurrencyCode,
    PaymentMethodCode,
    RefundMethodCode,
    TicketCancellationPolicyCode,
    TicketDeliveryMethodCode,
    TicketStatusCode,
    TicketTypeCode,
    TransactionStatusCode,
)
from backend.schemas.common import PaginationResponse


class TicketItem(BaseModel):
    id: int
    name: str
    available_quantity: Optional[int]
    sold_quantity: Optional[int]
    quantity: int
    description: Optional[str]
    price: Optional[float]
    expired_at: Optional[datetime]
    type: Optional[TicketTypeCode]
    status: Optional[TicketStatusCode]
    sales_start_at: Optional[datetime]
    sales_end_at: Optional[datetime]
    delivery_method: Optional[TicketDeliveryMethodCode]
    cancellation_policy_code: Optional[TicketCancellationPolicyCode]
    cancellation_policy_extra_description: Optional[str]
    purchaseble: Optional[bool]


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


class ListingMyTicketsQueryParams(BaseModel):
    keyword: str | None = Field(Query(None))
    status: TransactionStatusCode = Field(Query(default=TransactionStatusCode.SUCCESS))

    page: int | None = Field(Query(default=1, le=100, ge=1))
    per_page: int | None = Field(Query(default=10, ge=1))


class ListingMyTicketsItem(BaseModel):
    id: int
    name: str
    price: float
    type: TicketTypeCode
    transaction_status: TransactionStatusCode
    description: str | None = None
    canceled_at: datetime | None = None
    canceled_reason_code: CancelTicketReasonCode | None = None
    refunded_at: datetime | None = None
    refunded_amount: float | None = None
    note: str | None = None
    event_name: str
    event_id: int
    event_slug: str
    event_cover_image_url: str
    event_start_at: datetime
    event_end_at: datetime
    event_application_start_at: datetime
    event_application_end_at: datetime
    application_id: int | None
    applied_at: datetime | None = None
    transaction_item_id: int
    transaction_id: int
    payment_method_code: PaymentMethodCode
    currency: CurrencyCode
    cancellation_policy_code: TicketCancellationPolicyCode
    cancellation_policy_extra_description: str | None = None
    cancelable_before_at: datetime | None = None
    refund_method_code: RefundMethodCode
    cancelation_fee: float | None = None
    cancelable: bool
    refunded_amount: float | None = None
    refund_percentage: float | None = None


class ListingMyTicketsResponse(PaginationResponse[ListingMyTicketsItem]):
    pass
