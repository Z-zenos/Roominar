from sqlmodel import Session

from backend.models.ticket import Ticket
from backend.schemas.ticket import CreateTicketRequest
from backend.utils.database import save


async def create_ticket(db: Session, request: CreateTicketRequest):
    ticket = Ticket(
        event_id=request.event_id,
        name=request.name,
        quantity=request.quantity,
        price=request.price,
        expired_at=request.expired_at,
        type=request.type,
        delivery_method=request.delivery_method,
        access_link_url=request.access_link_url,
        is_refundable=request.is_refundable,
        sales_end_at=request.sales_end_at,
        sales_start_at=request.sales_start_at,
    )
    try:
        ticket = save(db, ticket)

        return ticket.id
    except Exception as e:
        db.rollback()
        raise e
