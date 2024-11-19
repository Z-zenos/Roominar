from sqlmodel import Session, select

from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.user import User
from backend.utils.database import fetch_all


async def listing_tickets_of_event(db: Session, organizer: User, event_id: int):
    tickets = fetch_all(
        db,
        select(Ticket)
        .join(Event, Event.id == Ticket.event_id)
        .where(Ticket.event_id == event_id, Event.organization_id == organizer.id),
    )
    return tickets
