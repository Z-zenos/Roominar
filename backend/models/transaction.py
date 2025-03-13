from typing import Optional

from sqlmodel import Enum, Field

from backend.core.constants import CurrencyCode, PaymentMethodCode
from backend.models.base_model import BaseModel


class Transaction(BaseModel, table=True):
    __tablename__: str = "transactions"

    event_id: int = Field(foreign_key="events.id")
    application_id: int = Field(foreign_key="applications.id")
    quantity: int
    total_amount: float  # Total amount for the transaction

    payment_method_code: PaymentMethodCode = Field(sa_type=Enum(PaymentMethodCode))

    currency: CurrencyCode = Field(sa_type=Enum(CurrencyCode), default=CurrencyCode.VND)
    exchange_rate: float = Field(
        default=1.0
    )  # Exchange rate from the transaction currency to the event currency

    # Stripe-related fields
    stripe_payment_intent_id: Optional[str] = Field(
        default=None
    )  # Stripe payment intent ID
    stripe_checkout_session_id: Optional[str] = Field(default=None)  # Stripe session ID

    # Metadata and tracking
    reference: Optional[str]
