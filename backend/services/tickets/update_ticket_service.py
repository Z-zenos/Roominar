from sqlmodel import Session, select, update

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

    try:
        db.exec(
            update(Ticket)
            .where(Ticket.id == ticket_id)
            .values(
                name=request.name,
                quantity=request.quantity,
                price=request.price,
                expired_at=request.expired_at,
                type=request.type,
                delivery_method=request.delivery_method,
                access_link_url=request.access_link_url,
                sales_end_at=request.sales_end_at,
                sales_start_at=request.sales_start_at,
                description=request.description,
            )
        )
        ticket = db.get(Ticket, ticket_id)
        return ticket
    except Exception as e:
        db.rollback()
        raise e
