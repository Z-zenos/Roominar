from datetime import datetime

from openai import OpenAI
from sqlmodel import Session, select

from backend.core.config import settings
from backend.core.constants import EventStatusCode, TagAssociationEntityCode
from backend.core.error_code import ErrorCode
from backend.core.exception import BadRequestException
from backend.models import Event, Tag, User
from backend.models.tag_association import TagAssociation
from backend.schemas.event import GenerateEventAIRequest
from backend.utils.database import save

open_ai_key = settings.OPEN_AI_KEY


async def generate_event_ai(
    db: Session, organizer: User, request: GenerateEventAIRequest
):
    try:
        client = OpenAI(api_key=open_ai_key)
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful event planner assistant.",
                },
                {
                    "role": "user",
                    "content": "make me planning for event with title: " + request.name,
                },
            ],
        )
        ai_response = completion.choices[0].message.content
        print(ai_response)
        event = Event(
            organization_id=organizer.organization_id,
            name=(
                request.name
                if request.name
                else f"Draft Event {datetime.now().strftime('%Y/%m/%d %H:%M')}"
            ),
            start_at=request.start_at,
            end_at=request.end_at,
            application_start_at=request.application_start_at,
            application_end_at=request.application_end_at,
            total_ticket_number=request.total_ticket_number,
            is_offline=request.is_offline,
            is_online=request.is_online,
            organize_address=request.organize_address,
            status=EventStatusCode.DRAFT,
            created_by=organizer.id,
        )

        event = save(db, event)

        if request.tags:
            request_tags = db.exec(select(Tag.id).where(Tag.id.in_(request.tags))).all()
            if (not request_tags) or (len(request.tags) != len(request_tags)):
                raise BadRequestException(ErrorCode.ERR_TAG_NOT_FOUND)
            tags = [
                TagAssociation(
                    entity_id=event.id,
                    tag_id=tag_id,
                    entity_code=TagAssociationEntityCode.EVENT,
                )
                for tag_id in request.tags
            ]
            db.add_all(tags)

        db.commit()
        db.refresh()

        return event.id

    except Exception as e:
        print(e)
        db.rollback()
        raise e
