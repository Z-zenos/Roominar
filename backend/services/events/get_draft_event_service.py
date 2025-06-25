from datetime import datetime

from slugify import slugify
from sqlmodel import Session, select

import backend.services.tags as tag_service
import backend.services.tickets as ticket_service
from backend.core.constants import EventStatusCode
from backend.core.simple_cache import cached_response
from backend.models.event import Event
from backend.models.user import User
from backend.utils.database import transaction_scope


@cached_response(
    cache_key="events:draft",
    ttl=300,  # 5 minutes
    include_user=True,
    include_params=False,
)
def get_draft_event(db: Session, organizer: User):
    """Get or create draft event for organizer"""

    with transaction_scope() as session:
        # Look for existing draft
        event = session.exec(
            select(Event).where(
                Event.organization_id == organizer.organization_id,
                Event.status == EventStatusCode.DRAFT,
            )
        ).first()

        if not event:
            # Create new draft event
            name = f"Draft Event {datetime.now().strftime('%Y/%m/%d %H:%M')}"
            event = Event(
                organization_id=organizer.organization_id,
                status=EventStatusCode.DRAFT,
                name=name,
                slug=slugify(name),
            )
            session.add(event)
            session.commit()
            session.refresh(event)

        # Convert to dict for response
        event_dict = {
            "id": event.id,
            "name": event.name,
            "description": event.description,
            "slug": event.slug,
            "status": event.status,
            "organization_id": event.organization_id,
            "start_at": event.start_at,
            "end_at": event.end_at,
            "application_start_at": event.application_start_at,
            "application_end_at": event.application_end_at,
            "organize_address": event.organize_address,
            "organize_city_code": event.organize_city_code,
            "is_online": event.is_online,
            "is_offline": event.is_offline,
            "meeting_tool_code": event.meeting_tool_code,
            "meeting_url": event.meeting_url,
            "cover_image_url": event.cover_image_url,
            "banner_image_url": event.banner_image_url,
            "contact_email": event.contact_email,
            "contact_url": event.contact_url,
            "target_id": event.target_id,
            "survey_id": event.survey_id,
            "gallery": event.gallery or [],
        }

        # Get related data (tickets and tags) synchronously
        event_dict["tickets"] = ticket_service.listing_tickets_of_event(
            db, organizer, event.id
        )

        if len(event_dict["tickets"]) == 0:
            ticket = ticket_service.create_default_ticket(db, event.id)
            event_dict["tickets"] = [ticket] if ticket else []

        event_dict["tags"] = tag_service.get_event_tags(db, event.id)

        return event_dict
