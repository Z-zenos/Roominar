from typing import Optional

from sqlmodel import Enum, Field

from backend.core.constants import TransactionStatusCode, TransactionTypeCode
from backend.models.base_model import BaseModel


class Transaction(BaseModel, table=True):
    __tablename__: str = "transactions"

    event_id: int = Field(foreign_key="events.id")
    application_id: int = Field(foreign_key="applications.id")
    quantity: int
    total_amount: float  # Total amount for the transaction
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
