from typing import Optional

from sqlmodel import Enum, Field

from backend.core.constants import TransactionStatusCode, TransactionTypeCode
from backend.models.base_model import BaseModel


class Transaction(BaseModel, table=True):
    __tablename__: str = "transactions"

    application_id: int = Field(foreign_key="applications.id")
    ticket_id: int = Field(foreign_key="tickets.id")
    quantity: int
    status: Optional[TransactionStatusCode] = Field(sa_type=Enum(TransactionStatusCode))
    type: Optional[TransactionTypeCode] = Field(sa_type=Enum(TransactionTypeCode))
    total_amount: Optional[float]
