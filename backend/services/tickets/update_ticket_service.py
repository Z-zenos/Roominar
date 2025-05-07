from sqlmodel import Session, select

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.user import User
from backend.schemas.ticket import UpdateTicketRequest
from backend.utils.database import fetch_one, save


async def update_ticket(
    db: Session, organizer: User, request: UpdateTicketRequest, ticket_id: int
):
    ticket = fetch_one(
        db,
        select(Ticket)
        .join(Event, Event.id == Ticket.event_id)
        .where(
            Ticket.id == ticket_id, Event.organization_id == organizer.organization_id
        ),
    )
    if not ticket:
        raise BadRequestException(
            ErrorCode.ERR_TICKET_NOT_FOUND,
            ErrorMessage.ERR_TICKET_NOT_FOUND,
        )

    ticket.name = request.name
    ticket.quantity = request.quantity
    ticket.price = request.price
    ticket.expired_at = request.expired_at
    ticket.type = request.type
    ticket.delivery_method = request.delivery_method
    ticket.access_link_url = request.access_link_url
    ticket.sales_end_at = request.sales_end_at
    ticket.sales_start_at = request.sales_start_at
    ticket.description = request.description

    try:
        ticket = save(db, ticket)

        return ticket
    except Exception as e:
        db.rollback()
        raise e
