from sqlmodel import Session

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.ticket import Ticket


async def get_draft_ticket(db: Session, ticket_id):
    ticket = db.get(Ticket, ticket_id)
    if not ticket:
        raise BadRequestException(
            ErrorCode.ERR_TICKET_NOT_FOUND,
            ErrorMessage.ERR_TICKET_NOT_FOUND,
        )

    return ticket
