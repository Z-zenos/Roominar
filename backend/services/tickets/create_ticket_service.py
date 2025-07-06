from sqlmodel import Session, select

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.user import User
from backend.schemas.ticket import CreateTicketRequest
from backend.utils.database import fetch_one, save


async def create_ticket(db: Session, organizer: User, request: CreateTicketRequest):
    event = fetch_one(
        db,
        select(Event).where(
            Event.id == request.event_id,
            Event.organization_id == organizer.organization_id,
        ),
    )

    if not event:
        raise BadRequestException(
            ErrorCode.ERR_EVENT_NOT_FOUND,
            ErrorMessage.ERR_EVENT_NOT_FOUND,
        )

    ticket = Ticket(
        event_id=request.event_id,
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
        cancelable_before_at=request.sales_end_at or event["start_at"],
    )
    try:
        ticket = save(db, ticket)

        return ticket.id
    except Exception as e:
        db.rollback()
        raise e
