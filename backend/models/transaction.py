from typing import Optional

from sqlmodel import Enum, Field

from backend.core.constants import TransactionStatusCode, TransactionTypeCode
from backend.models.base_model import BaseModel


class Transaction(BaseModel, table=True):
    __tablename__: str = "transactions"

    application_id: int = Field(foreign_key="applications.id")
    ticket_id: int = Field(foreign_key="tickets.id")
    quantity: int
    total_amount: float  # Total amount for the transaction
    refunded_amount: Optional[float] = Field(default=0.0)  # Amount refunded (if any)
    status: TransactionStatusCode = Field(
        sa_type=Enum(TransactionStatusCode), default=TransactionStatusCode.PENDING
    )  # Default status
    type: Optional[TransactionTypeCode] = Field(sa_type=Enum(TransactionTypeCode))

    # Stripe-related fields
    stripe_payment_intent_id: Optional[str] = Field(
        default=None
    )  # Stripe payment intent ID
    stripe_checkout_session_id: Optional[str] = Field(default=None)  # Stripe session ID

    # Metadata and tracking
    reference: Optional[str]
