from datetime import datetime

from fastapi import Query
from pydantic import BaseModel, Field

from backend.core.constants import (
    CancelTicketReasonCode,
    CurrencyCode,
    PaymentMethodCode,
    RefundMethodCode,
    TicketCancellationPolicyCode,
    TicketTypeCode,
    TransactionStatusCode,
)
from backend.schemas.common import PaginationResponse


class MyTicketTransactionItem(BaseModel):
    id: int
    ticket_id: int
    ticket_name: str
    ticket_price: float
    ticket_type: TicketTypeCode
    event_access_link_url: str | None = None
    amount: float
    note: str | None = None


class MyTicketTransaction(BaseModel):
    id: int
    transaction_status: TransactionStatusCode
    total_amount: int
    purchased_at: datetime
    ticket_transaction_items: list[MyTicketTransactionItem] = Field([])
    quantity: int


class AttendeeTicketTransactionItem(BaseModel):
    id: int
    ticket_id: int
    ticket_name: str
    ticket_price: float
    ticket_type: TicketTypeCode
    event_access_link_url: str | None = None
    amount: float
    note: str | None = None


class AttendeeTicketTransaction(BaseModel):
    id: int
    transaction_status: TransactionStatusCode
    total_amount: int
    purchased_at: datetime
    ticket_transaction_items: list[AttendeeTicketTransactionItem] = Field([])
    quantity: int


class ListingMyTransactionsQueryParams(BaseModel):
    keyword: str | None = Field(Query(None))
    status: TransactionStatusCode = Field(Query(default=TransactionStatusCode.SUCCESS))
    transaction_id: int | None = Field(Query(None))

    page: int | None = Field(Query(default=1, le=100, ge=1))
    per_page: int | None = Field(Query(default=10, ge=1))


class ListingMyTransactionTicketItem(BaseModel):
    id: int
    name: str
    price: float
    type: TicketTypeCode
    transaction_status: TransactionStatusCode
    cancellation_policy_code: TicketCancellationPolicyCode
    cancellation_policy_extra_description: str | None = None
    cancelable_before_at: datetime | None = None
    refund_method_code: RefundMethodCode
    refund_percentage: float | None = None
    description: str | None = None
    canceled_at: datetime | None = None
    cancel_reason_code: CancelTicketReasonCode | None = None
    refunded_at: datetime | None = None
    refunded_amount: float | None = None
    note: str | None = None
    transaction_item_id: int
    cancelation_fee: float | None = None
    cancelable: bool
    refunded_amount: float | None = None
    qr_code_url: str | None = None
    check_in_at: datetime | None = None


class ListingMyTransactionsItem(BaseModel):
    id: int
    status: TransactionStatusCode
    payment_method_code: PaymentMethodCode
    currency: CurrencyCode
    total_amount: float
    quantity: int
    purchased_at: datetime
    refunded_at: datetime | None = None
    refunded_amount: float | None = None
    refund_percentage: float | None = None
    canceled_at: datetime | None = None
    cancel_reason_code: CancelTicketReasonCode | None = None
    cancellation_policy_code: TicketCancellationPolicyCode | None = None

    application_email: str | None = None
    application_phone_number: str | None = None
    application_full_name: str | None = None

    event_name: str
    event_id: int
    event_slug: str
    event_cover_image_url: str
    event_start_at: datetime
    event_end_at: datetime
    event_application_start_at: datetime
    event_application_end_at: datetime

    tickets: list[ListingMyTransactionTicketItem] = Field([])


class ListingMyTransactionsResponse(PaginationResponse[ListingMyTransactionsItem]):
    pass


class GetTransactionStatusCountsResponse(BaseModel):
    __annotations__ = {status.value: int for status in TransactionStatusCode}
