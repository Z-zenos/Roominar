from sqlmodel import Session, select

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.user import User
from backend.schemas.ticket import CreateTicketRequest
from backend.utils.database import transaction_scope


def create_ticket(db: Session, organizer: User, request: CreateTicketRequest):
    """Create a new ticket with proper session management"""

    with transaction_scope() as session:
        try:
            # Verify event belongs to organizer's organization
            event = session.exec(
                select(Event).where(
                    Event.id == request.event_id,
                    Event.organization_id == organizer.organization_id,
                )
            ).first()

            if not event:
                raise BadRequestException(
                    ErrorCode.ERR_EVENT_NOT_FOUND,
                    ErrorMessage.ERR_EVENT_NOT_FOUND,
                )

            # Create new ticket
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
                cancelable_before_at=request.sales_end_at,
                created_by=organizer.id,
                updated_by=organizer.id,
            )

            session.add(ticket)
            session.commit()
            session.refresh(ticket)

            # Invalidate event-related caches
            from backend.core.simple_cache import invalidate_pattern_caches

            invalidate_pattern_caches(f"events:*{request.event_id}*")
            invalidate_pattern_caches(f"tickets:*{request.event_id}*")

            return ticket.id

        except BadRequestException:
            raise
        except Exception as e:
            raise BadRequestException(
                ErrorCode.ERR_INTERNAL_SERVER_ERROR,
                f"Failed to create ticket: {str(e)}",
            )
