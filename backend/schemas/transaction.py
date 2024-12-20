from datetime import datetime

from pydantic import BaseModel

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
