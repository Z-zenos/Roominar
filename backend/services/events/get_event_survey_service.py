from sqlmodel import Session

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.event import Event
from backend.services.surveys.get_survey_detail_service import get_survey_detail


async def get_event_survey(
    db: Session,
    event_id: int,
) -> dict:
    event = db.get(Event, event_id)

    if not event:
        raise BadRequestException(
            ErrorCode.ERR_EVENT_NOT_FOUND,
            ErrorMessage.ERR_EVENT_NOT_FOUND,
        )

    survey = get_survey_detail(db, event.survey_id) if event.survey_id else None

    return survey
