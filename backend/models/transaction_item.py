from datetime import datetime
from typing import Optional

from sqlmodel import DateTime, Enum, Field, String

from backend.core.constants import (
    CancelTicketReasonCode,
    RefundReasonCode,
    TransactionStatusCode,
)
from backend.models.base_model import BaseModel


class TransactionItem(BaseModel, table=True):
    __tablename__: str = "transaction_items"

    transaction_id: int = Field(foreign_key="transactions.id")
    ticket_id: int = Field(foreign_key="tickets.id")
    amount: float = Field(default=0.0)
    refunded_amount: Optional[float]
    refunded_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    refund_reason_code: Optional[RefundReasonCode] = Field(
        sa_type=Enum(RefundReasonCode)
    )
    note: Optional[str] = Field(sa_type=String(255))
    status: TransactionStatusCode = Field(
        sa_type=Enum(TransactionStatusCode), default=TransactionStatusCode.PENDING
    )
    cancel_reason_code: Optional[CancelTicketReasonCode] = Field(
        sa_type=Enum(CancelTicketReasonCode)
    )
    canceled_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    user_id: Optional[int] = Field(foreign_key="users.id")
