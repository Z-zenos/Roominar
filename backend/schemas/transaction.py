from datetime import datetime

from pydantic import BaseModel, Field

from backend.core.constants import TicketTypeCode, TransactionStatusCode


class TicketTransaction(BaseModel):
    ticket_id: int
    ticket_name: str
    ticket_price: int
    ticket_type: TicketTypeCode
    event_access_link_url: str | None = None
    ticket_description: str | None = None
    transaction_id: int
    purchased_quantity: int
    total_amount: int
    purchased_at: datetime
    transaction_status: TransactionStatusCode


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
