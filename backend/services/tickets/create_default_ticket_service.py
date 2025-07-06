from sqlmodel import Session

from backend.core.constants import (
    TicketDeliveryMethodCode,
    TicketStatusCode,
    TicketTypeCode,
)
from backend.models.ticket import Ticket
from backend.utils.database import save


async def create_default_ticket(db: Session, event: dict):
    try:
        ticket = Ticket(
            event_id=event["id"],
            name="Vé mẫu",
            description="Vé mẫu",
            price=0.0,
            quantity=100,
            type=TicketTypeCode.FREE,
            status=TicketStatusCode.AVAILABLE,
            delivery_method=TicketDeliveryMethodCode.BOTH,
            cancelable_before_at=event["start_at"],
        )
        ticket = save(db, ticket)
        return ticket

    except Exception as e:
        db.rollback()
        raise e
