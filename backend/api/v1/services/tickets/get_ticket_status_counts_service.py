from sqlmodel import Session, func, select

from backend.core.constants import TransactionStatusCode
from backend.models.transaction_item import TransactionItem
from backend.models.user import User
from backend.schemas.ticket import GetTicketStatusCountsResponse


async def get_ticket_status_counts(db: Session, user: User):
    status_counts = (
        db.exec(
            select(TransactionItem.status, func.count())
            .where(TransactionItem.user_id == user.id)
            .group_by(TransactionItem.status)
        )
        .mappings()
        .all()
    )

    result = {status.value: 0 for status in TransactionStatusCode}

    for row in status_counts:
        result[row["status"]] = row["count"]

    return GetTicketStatusCountsResponse(**result)
