from datetime import datetime

import pytz
from sqlmodel import Session, select, update

from backend.core.constants import TicketTypeCode, TransactionStatusCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.ticket_inventory import TicketInventory
from backend.models.transaction_item import TransactionItem
from backend.models.user import User
from backend.schemas.ticket import CancelTicketsRequest


async def cancel_tickets(db: Session, user: User, request: CancelTicketsRequest):
    try:
        transaction_items = (
            db.exec(
                select(
                    TransactionItem.transaction_id,
                    TransactionItem.status,
                    Ticket.id,
                    Ticket.type,
                    Ticket.price,
                    Event.start_at,
                )
                .join(TransactionItem, TransactionItem.ticket_id == Ticket.id)
                .join(Event, Event.id == Ticket.event_id)
                .where(
                    Ticket.id.in_(request.ticket_ids),
                    TransactionItem.user_id == user.id,
                )
            )
            .mappings()
            .all()
        )

        if not transaction_items:
            raise BadRequestException(
                ErrorCode.ERR_INVALID_TICKET,
                ErrorMessage.ERR_INVALID_TICKET,
            )

        if transaction_items[0]["start_at"] < datetime.now(pytz.utc):
            raise BadRequestException(
                ErrorCode.ERR_INVALID_CANCEL_TICKET_DATETIME,
                ErrorMessage.ERR_INVALID_CANCEL_TICKET_DATETIME,
            )

        free_ticket_ids = [
            item["ticket_id"]
            for item in transaction_items
            if item["type"] == TicketTypeCode.FREE
        ]
        paid_ticket_ids = [
            item["ticket_id"]
            for item in transaction_items
            if item["type"] != TicketTypeCode.FREE
        ]

        if free_ticket_ids and len(free_ticket_ids) > 0:
            db.exec(
                update(TransactionItem)
                .where(TransactionItem.ticket_id.in_(free_ticket_ids))
                .values(
                    status=TransactionStatusCode.capitalize,
                    canceled_at=datetime.now(),
                    cancel_reason_code=request.reason,
                )
            )

        if paid_ticket_ids and len(paid_ticket_ids) > 0:
            db.exec(
                update(TransactionItem)
                .where(TransactionItem.ticket_id.in_(paid_ticket_ids))
                .values(
                    status=TransactionStatusCode.CANCELED,
                    canceled_at=datetime.now(),
                    cancel_reason_code=request.reason,
                )
            )

        db.exec(
            TicketInventory.update()
            .where(
                TicketInventory.ticket_id.in_(
                    [item["ticket_id"] for item in transaction_items]
                )
            )
            .values(
                quantity=TicketInventory.available_quantity + 1,
                sold_quantity=TicketInventory.sold_quantity - 1,
            )
        )

        db.commit()
        return len(request.ticket_ids)

    except Exception as e:
        db.rollback()
        raise e
