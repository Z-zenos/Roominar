from datetime import datetime

from pydantic import BaseModel, Field

from backend.core.constants import TicketTypeCode, TransactionStatusCode


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
