from datetime import datetime
from typing import Any, Dict

import pytz
from sqlmodel import Session, and_, col, func, select

from backend.core.constants import TransactionStatusCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.application import Application
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.ticket_inventory import TicketInventory
from backend.models.transaction import Transaction
from backend.models.transaction_item import TransactionItem
from backend.utils.database import transaction_scope


def validate_application_tickets(
    db: Session, user_id: int, request: Any, is_free_application: bool
) -> Dict[str, Any]:
    """
    Validate tickets for an event application with proper session management.

    Args:
        db: Database session
        user_id: ID of the user making the application
        request: Application request containing event_id and tickets
        is_free_application: Whether this is a free application

    Returns:
        Dict containing validated event, tickets, quantities and existing application

    Raises:
        BadRequestException: For various validation failures
    """
    request_dict = dict(request)
    event_id = request_dict.get("event_id")
    request_tickets = [dict(ticket) for ticket in request_dict.get("tickets", [])]

    with transaction_scope() as session:
        # Get event with a single query
        event = session.get(Event, event_id)
        if not event:
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NOT_FOUND,
                ErrorMessage.ERR_EVENT_NOT_FOUND,
            )

        # Check application deadline
        current_time = datetime.now(pytz.utc)
        if event.application_end_at and event.application_end_at < current_time:
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NO_LONGER_OPEN_APPLY,
                ErrorMessage.ERR_EVENT_NO_LONGER_OPEN_APPLY,
            )

        # Optimize ticket query by joining all needed tables at once
        tickets_query = (
            select(
                Ticket,
                TicketInventory.available_quantity,
                TicketInventory.sold_quantity,
                col(TicketInventory.id).label("ticket_inventory_id"),
            )
            .join(Event, Event.id == Ticket.event_id)
            .join(TicketInventory, TicketInventory.ticket_id == Ticket.id)
            .where(
                and_(
                    col(Ticket.id).in_([ticket["id"] for ticket in request_tickets]),
                    Event.id == event_id,
                )
            )
        )
        tickets = [dict(t) for t in session.exec(tickets_query).all()]

        # Validate ticket existence
        if len(tickets) != len(request_tickets):
            raise BadRequestException(
                ErrorCode.ERR_INVALID_TICKET, ErrorMessage.ERR_INVALID_TICKET
            )

        # Validate ticket quantities and pricing
        total_requested_quantity = 0
        for ticket in tickets:
            # Get requested quantity for this ticket
            ticket["requested_quantity"] = next(
                (
                    request_ticket["quantity"]
                    for request_ticket in request_tickets
                    if request_ticket["id"] == ticket["id"]
                ),
                0,
            )

            # Validate free ticket requirement
            if ticket["price"] > 0 and is_free_application:
                raise BadRequestException(
                    ErrorCode.ERR_TICKET_NOT_FREE, ErrorMessage.ERR_TICKET_NOT_FREE
                )

            # Validate availability
            if ticket["available_quantity"] == 0:
                raise BadRequestException(
                    ErrorCode.ERR_TICKET_SOLD_OUT,
                    ErrorMessage.ERR_TICKET_SOLD_OUT,
                )

            if ticket["available_quantity"] < ticket["requested_quantity"]:
                raise BadRequestException(
                    ErrorCode.ERR_NOT_ENOUGH_TICKETS_FOR_REQUEST,
                    ErrorMessage.ERR_NOT_ENOUGH_TICKETS_FOR_REQUEST,
                )

            total_requested_quantity += ticket["requested_quantity"]

        # Get existing application with purchased tickets in a single query
        application_query = (
            select(
                Application,
                func.count(TransactionItem.id).label("purchased_ticket_number"),
            )
            .outerjoin(
                Transaction,
                and_(
                    Transaction.application_id == Application.id,
                    Transaction.status == TransactionStatusCode.SUCCESS,
                ),
            )
            .outerjoin(
                TransactionItem,
                TransactionItem.transaction_id == Transaction.id,
            )
            .where(
                and_(
                    Application.event_id == event_id,
                    Application.user_id == user_id,
                )
            )
            .group_by(Application)
        )
        application = session.exec(application_query).one_or_none()

        # Validate maximum tickets per account
        if application and event.max_ticket_number_per_account:
            purchased_tickets = getattr(application, "purchased_ticket_number", 0) or 0
            if (
                purchased_tickets + total_requested_quantity
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
