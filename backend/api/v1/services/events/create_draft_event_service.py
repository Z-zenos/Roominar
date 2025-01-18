from datetime import datetime

from sqlmodel import Session

from backend.core.constants import EventStatusCode
from backend.models.event import Event
from backend.models.user import User
from backend.schemas.event import CreateDraftEventRequest
from backend.utils.database import save


async def create_draft_event(
    db: Session, organizer: User, request: CreateDraftEventRequest
):
    if not request.event_id:
        event = Event(
            organization_id=organizer.organization_id,
            status=EventStatusCode.DRAFT,
            name=f"""
                Draft Event {datetime.now().strftime("%Y/%m/%d %H:%M")}""",
        )
        save(event)
        return event.id

    return None
