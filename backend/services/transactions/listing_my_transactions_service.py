from datetime import datetime, timezone

from sqlmodel import Session, func, or_, select

from backend.core.constants import TicketCancellationPolicyCode, TransactionStatusCode
from backend.models.application import Application
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.transaction import Transaction
from backend.models.transaction_item import TransactionItem
from backend.models.user import User
from backend.schemas.transaction import ListingMyTransactionsQueryParams


async def listing_my_transactions(
    db: Session, user: User, query_params: ListingMyTransactionsQueryParams
):
    filters = _build_filters(user, query_params)
    transactions = await _get_my_transactions(db, filters, query_params)
    total = await _count_my_transactions(db, filters)
    return transactions, total


async def _get_my_transactions(
    db: Session, filters: list, query_params: ListingMyTransactionsQueryParams
):
    query = (
        select(
            Transaction.id,
            Transaction.payment_method_code,
            Transaction.currency,
            Transaction.total_amount,
            Transaction.quantity,
            Transaction.status,
            Transaction.created_at.label("purchased_at"),
            Event.id.label("event_id"),
            Event.name.label("event_name"),
            Event.cover_image_url.label("event_cover_image_url"),
            Event.slug.label("event_slug"),
            Event.start_at.label("event_start_at"),
            Event.end_at.label("event_end_at"),
            Event.application_start_at.label("event_application_start_at"),
            Event.application_end_at.label("event_application_end_at"),
            Application.id.label("application_id"),
            Application.email.label("application_email"),
            Application.phone.label("application_phone_number"),
            func.concat(Application.first_name, " ", Application.last_name).label(
                "application_full_name"
            ),
            func.json_agg(
                func.json_build_object(
                    "id",
                    Ticket.id,
                    "name",
                    Ticket.name,
                    "price",
                    Ticket.price,
                    "type",
                    Ticket.type,
                    "cancellation_policy_code",
                    Ticket.cancellation_policy_code,
                    "cancellation_policy_extra_description",
                    Ticket.cancellation_policy_extra_description,
                    "cancelable_before_at",
                    Ticket.cancelable_before_at,
                    "refund_method_code",
                    Ticket.refund_method_code,
                    "cancelation_fee",
                    Ticket.cancelation_fee,
                    "refund_percentage",
                    Ticket.refund_percentage,
                    "description",
                    Ticket.description,
                    "transaction_item_id",
                    TransactionItem.id.label("transaction_item_id"),
                    "transaction_status",
                    TransactionItem.status,
                    "canceled_at",
                    TransactionItem.canceled_at,
                    "cancel_reason_code",
                    TransactionItem.cancel_reason_code,
                    "refunded_at",
                    TransactionItem.refunded_at,
                    "refunded_amount",
                    TransactionItem.refunded_amount,
                    "note",
                    TransactionItem.note,
                    "qr_code_url",
                    TransactionItem.qr_code_url,
                )
            ).label("tickets"),
        )
        .select_from(Transaction)
        .join(Application, Application.id == Transaction.application_id)
        .join(TransactionItem, TransactionItem.transaction_id == Transaction.id)
        .join(Ticket, Ticket.id == TransactionItem.ticket_id)
        .join(Event, Event.id == Ticket.event_id)
        .where(*filters)
        .group_by(Transaction.id, Event.id, Application.id)
        .having(func.count(TransactionItem.id) > 0)
        .limit(query_params.per_page)
        .offset((query_params.page - 1) * query_params.per_page)
        .order_by(Transaction.created_at.desc())
    )

    transactions = db.exec(query).mappings().all()

    transactions = [dict(transaction) for transaction in transactions]
    now = datetime.now(timezone.utc)
    for transaction in transactions:
        tickets = [dict(ticket) for ticket in transaction["tickets"]]

        for ticket in tickets:
            if (
                ticket["canceled_at"]
                or ticket["transaction_status"] == TransactionStatusCode.CANCELED
            ):
                ticket["cancelable"] = False
                ticket["refundable_amount"] = 0.0
                continue

            ticket["cancelable_before_at"] = (
                ticket["cancelable_before_at"]
                if ticket["cancelable_before_at"]
                else transaction["event_start_at"]
            )
            ticket["cancelable_before_at"] = (
                ticket["cancelable_before_at"]
                if ticket["cancelable_before_at"]
                else transaction["event_start_at"]
            )
            cancelable_before = (
                datetime.fromisoformat(ticket["cancelable_before_at"])
                if isinstance(ticket["cancelable_before_at"], str)
                else ticket["cancelable_before_at"]
            )

            if ticket["cancellation_policy_code"] == "NON_TRANSFERABLE":
                ticket["cancelable"] = False
                ticket["refundable_amount"] = 0.0
                continue

            if now > cancelable_before:
                ticket["cancelable"] = False
                ticket["refundable_amount"] = 0.0
                continue

            ticket["cancelable"] = True

            if (
                ticket["cancellation_policy_code"]
                == TicketCancellationPolicyCode.NO_REFUND
            ):
                ticket["refundable_amount"] = 0.0
            elif (
                ticket["cancellation_policy_code"]
                == TicketCancellationPolicyCode.FULL_REFUND
            ):
                ticket["refundable_amount"] = ticket["price"]
            elif (
                ticket["cancellation_policy_code"]
                == TicketCancellationPolicyCode.PARTIAL_REFUND
            ):
                refund_rate = ticket["refund_percentage"] or 0.0
                ticket["refundable_amount"] = ticket["price"] * refund_rate
            elif (
                ticket["cancellation_policy_code"]
                == TicketCancellationPolicyCode.REFUND_BY_DATETIME
            ):
                days_before_event = (transaction["event_start_at"] - now).days
                if days_before_event >= 7:
                    ticket["refundable_amount"] = ticket["price"] * 0.8
                elif days_before_event >= 3:
                    ticket["refundable_amount"] = ticket["price"] * 0.5
                else:
                    ticket["refundable_amount"] = 0.0

        transaction["tickets"] = tickets

    return transactions


async def _count_my_transactions(db: Session, filters: list):
    query = (
        select(func.count(Transaction.id))
        .select_from(Transaction)
        .join(TransactionItem, TransactionItem.transaction_id == Transaction.id)
        .where(*filters)
    )
    total = db.scalar(query) or 0

    return total


def _build_filters(user: User, query_params: ListingMyTransactionsQueryParams):
    filters = [TransactionItem.user_id == user.id]

    if query_params.keyword:
        filters.append(
            or_(
                Event.name.contains(query_params.keyword),
                Ticket.name.contains(query_params.keyword),
            )
        )

    if query_params.status:
        filters.append(Transaction.status == query_params.status)

    return filters
