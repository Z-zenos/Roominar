from sqlmodel import Session, func, select

from backend.core.constants import EventStatusCode
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.ticket_inventory import TicketInventory
from backend.models.user import User
from backend.schemas.organization import GetTicketStatsQueryParams


async def get_ticket_stats(
    db: Session, organizer: User, query_params: GetTicketStatsQueryParams
):
    filters = query_params.model_dump(exclude_none=True)

    query = (
        select(
            func.coalesce(func.sum(TicketInventory.sold_quantity), 0).label(
                "total_sold_tickets"
            ),
            func.coalesce(func.sum(TicketInventory.available_quantity), 0).label(
                "total_remaining_tickets"
            ),
            func.coalesce(func.sum(TicketInventory.reserved_quantity), 0).label(
                "total_reserved_tickets"
            ),
            func.coalesce(
                func.sum(Ticket.price * TicketInventory.sold_quantity), 0
            ).label("total_revenue"),
        )
        .join(Event, TicketInventory.event_id == Event.id)
        .join(Ticket, TicketInventory.ticket_id == Ticket.id)
        .where(
            Event.organization_id == organizer.organization_id,
            Event.status == EventStatusCode.PUBLIC,
        )
    )

    if "event_id" in filters and filters["event_id"] != 0:
        query = query.where(Event.id == filters["event_id"])
    if "start_date" in filters:
        query = query.where(Ticket.sales_start_at >= filters["start_date"])
    if "end_date" in filters:
        query = query.where(Ticket.sales_end_at <= filters["end_date"])
    if "ticket_type" in filters:
        query = query.where(Ticket.type == filters["ticket_type"])
    if "ticket_status" in filters:
        query = query.where(Ticket.status == filters["ticket_status"])

    ticket_stats = db.exec(query).mappings().one_or_none()

    total_sold_tickets = ticket_stats.total_sold_tickets
    total_remaining_tickets = ticket_stats.total_remaining_tickets
    total_reserved_tickets = ticket_stats.total_reserved_tickets
    total_revenue = ticket_stats.total_revenue

    total_tickets = (
        total_sold_tickets + total_remaining_tickets + total_reserved_tickets
    )

    sold_percentage = (
        (total_sold_tickets / total_tickets) * 100 if total_tickets > 0 else 0
    )
    remaining_percentage = (
        (total_remaining_tickets / total_tickets) * 100 if total_tickets > 0 else 0
    )
    reserved_percentage = (
        (total_reserved_tickets / total_tickets) * 100 if total_tickets > 0 else 0
    )

    return {
        "total_sold_tickets": total_sold_tickets,
        "total_remaining_tickets": total_remaining_tickets,
        "total_reserved_tickets": total_reserved_tickets,
        "total_tickets": total_tickets,
        "sold_percentage": round(sold_percentage, 2),
        "remaining_percentage": round(remaining_percentage, 2),
        "reserved_percentage": round(reserved_percentage, 2),
        "total_revenue": round(total_revenue, 2),
    }
