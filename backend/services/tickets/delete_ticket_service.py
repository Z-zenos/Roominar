from sqlmodel import Session, select

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.user import User
from backend.utils.database import fetch_one


async def delete_ticket(db: Session, organizer: User, ticket_id: int):
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
        db.delete(ticket)
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
