from sqlmodel import func, select

from backend.core.constants import TransactionStatusCode
from backend.models.application import Application
from backend.models.transaction import Transaction


def get_sold_tickets_number_query(event_id: int, user_id: int):
    query = (
        select(
            Application.event_id,
            func.sum(Transaction.quantity).label("sold_tickets_number,"),
        )
        .join(Application, Application.id == Transaction.application_id)
        .where(
            Transaction.status == TransactionStatusCode.SUCCESS,
        )
        .group_by(Application.event_id)
        .subquery()
    )

    if event_id:
        query = query.where(Application.event_id == event_id)

    if user_id:
        query = query.where(Application.user_id == user_id)

    return query
