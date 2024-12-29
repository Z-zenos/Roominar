from datetime import datetime

import pytz
from sqlmodel import Session, func, select

from backend.core.constants import TransactionStatusCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.application import Application
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.ticket_inventory import TicketInventory
from backend.models.transaction import Transaction
from backend.models.transaction_item import TransactionItem


def validate_application_tickets(db: Session, user_id: int, request: any):
    event_id = request.event_id
    try:
        event = db.get(Event, event_id)

        # Check if the event exists
        if not event:
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NOT_FOUND,
                ErrorMessage.ERR_EVENT_NOT_FOUND,
            )

        # Check if the event is still open for application
        if event.application_end_at < datetime.now(pytz.utc):
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NO_LONGER_OPEN_APPLY,
                ErrorMessage.ERR_EVENT_NO_LONGER_OPEN_APPLY,
            )

        tickets = (
            db.exec(
                select(
                    Ticket.__table__.columns,
                    TicketInventory.available_quantity,
                    TicketInventory.sold_quantity,
                    TicketInventory.id.label("ticket_inventory_id"),
                )
                .join(Event, Event.id == Ticket.event_id)
                .join(TicketInventory, TicketInventory.ticket_id == Ticket.id)
                .where(
                    Ticket.id.in_([ticket.id for ticket in request.tickets]),
                    Event.id == event_id,
                )
            )
            .mappings()
            .all()
        )

        # Check if tickets are really created from the event
        if len(tickets) != len(request.tickets):
            raise BadRequestException(
                ErrorCode.ERR_INVALID_TICKET, ErrorMessage.ERR_INVALID_TICKET
            )

        tickets = [dict(ticket) for ticket in tickets]
        total_requested_quantity = 0
        for ticket in tickets:
            # Check if the ticket is free
            if ticket["price"] > 0:
                raise BadRequestException(
                    ErrorCode.ERR_TICKET_NOT_FREE, ErrorMessage.ERR_TICKET_NOT_FREE
                )

            ticket["requested_quantity"] = next(
                (
                    request_ticket.quantity
                    for request_ticket in request.tickets
                    if request_ticket.id == ticket["id"]
                ),
                None,
            )

            # Check if the ticket is sold out
            if ticket["available_quantity"] == 0:
                raise BadRequestException(
                    ErrorCode.ERR_TICKET_SOLD_OUT,
                    ErrorMessage.ERR_TICKET_SOLD_OUT,
                )

            # Check if the requested quantity is greater than the available quantity
            if ticket["available_quantity"] < ticket["requested_quantity"]:
                raise BadRequestException(
                    ErrorCode.ERR_NOT_ENOUGH_TICKETS_FOR_REQUEST,
                    ErrorMessage.ERR_NOT_ENOUGH_TICKETS_FOR_REQUEST,
                )

            total_requested_quantity += ticket["requested_quantity"]

        application = db.exec(
            select(
                Application.__table__.columns,
                func.count(TransactionItem.id).label("purchased_ticket_number"),
            )
            .outerjoin(Transaction, Transaction.application_id == Application.id)
            .outerjoin(
                TransactionItem, TransactionItem.transaction_id == Transaction.id
            )
            .where(
                Application.event_id == event_id,
                Application.user_id == user_id,
                Transaction.status == TransactionStatusCode.SUCCESS,
            )
            .group_by(Application.id)
        ).one_or_none()

        # Check if the user has reached the maximum ticket number per account
        if application and (
            (application.purchased_ticket_number or 0) + total_requested_quantity
            > event.max_ticket_number_per_account
        ):
            raise BadRequestException(
                ErrorCode.ERR_MAXIMUM_TICKETS_PER_APPLICATION_REACHED,
                ErrorMessage.ERR_MAXIMUM_TICKETS_PER_APPLICATION_REACHED,
            )

        return {
            "event": event,
            "tickets": tickets,
            "total_requested_quantity": total_requested_quantity,
            "application": application,
        }

    except Exception as e:
        raise e
