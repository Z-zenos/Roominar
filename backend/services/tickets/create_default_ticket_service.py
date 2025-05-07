from sqlmodel import Session

from backend.core.constants import (
    TicketDeliveryMethodCode,
    TicketStatusCode,
    TicketTypeCode,
)
from backend.models.ticket import Ticket
from backend.utils.database import save


async def create_default_ticket(db: Session, event_id: int):
    try:
        ticket = Ticket(
            event_id=event_id,
            name="General Admission",
            description="General Admission",
            price=0.0,
            quantity=100,
            type=TicketTypeCode.FREE,
            status=TicketStatusCode.AVAILABLE,
            delivery_method=TicketDeliveryMethodCode.BOTH,
        )
        ticket = save(db, ticket)
        return ticket

    except Exception as e:
        db.rollback()
        raise e
