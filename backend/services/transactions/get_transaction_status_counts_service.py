from sqlmodel import Session, func, select

from backend.core.constants import TransactionStatusCode
from backend.models.transaction import Transaction
from backend.models.transaction_item import TransactionItem
from backend.models.user import User
from backend.schemas.transaction import GetTransactionStatusCountsResponse


async def get_transaction_status_counts(db: Session, user: User):
    status_counts = (
        db.exec(
            select(Transaction.status, func.count())
            .join(TransactionItem, TransactionItem.transaction_id == Transaction.id)
            .where(TransactionItem.user_id == user.id)
            .group_by(Transaction.status)
        )
        .mappings()
        .all()
    )

    result = {status.value: 0 for status in TransactionStatusCode}

    for row in status_counts:
        result[row["status"]] = row["count"]

    return GetTransactionStatusCountsResponse(**result)
