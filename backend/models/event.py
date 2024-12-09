import uuid
from datetime import datetime
from typing import Optional

from sqlmodel import ARRAY, Column, DateTime, Enum, Field, String, Text, func

from backend.core.constants import EventMeetingToolCode, EventStatusCode
from backend.models.base_model import BaseModel


class Event(BaseModel, table=True):
    __tablename__: str = "events"

    organization_id: Optional[int] = Field(foreign_key="organizations.id")

    name: str = Field(sa_type=String(1024))

    start_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    end_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))

    application_start_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    application_end_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))

    slug: str = Field(
        default=str(uuid.uuid4()),
        sa_column=Column(
            String(36),
            nullable=False,
            server_default=func.gen_random_uuid(),
        ),
    )

    status: Optional[EventStatusCode] = Field(sa_type=Enum(EventStatusCode))

    application_number: Optional[int]

    cover_image_url: Optional[str] = Field(sa_type=String(2048))
    gallery: Optional[list[str]] = Field(sa_type=ARRAY(String(2048)))
    description: Optional[str] = Field(sa_type=Text)
    is_online: Optional[bool]
    is_offline: Optional[bool]

    organize_place_name: Optional[str] = Field(sa_type=String(255))
    organize_city_code: Optional[str] = Field(sa_type=String(50))
    organize_address: Optional[str] = Field(sa_type=String(255))
    # organize_coordinates

    meeting_tool_code: Optional[EventMeetingToolCode] = Field(
        sa_type=Enum(EventMeetingToolCode)
    )
    meeting_url: Optional[str] = Field(sa_type=String(2048))

    survey_id: Optional[int] = Field(
        foreign_key="surveys.id",
    )
    # survey_form_url: Optional[str] = Field(sa_type=String(2048))

    target_id: Optional[int] = Field(foreign_key="targets.id")
    comment: Optional[str] = Field(sa_type=Text)

    tags: Optional[list[str]] = Field(sa_type=ARRAY(String(255)))

    published_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    application_form_url: Optional[str] = Field(sa_type=String(2048))
    view_number: Optional[int] = Field(default=0)
    max_application_number_per_account: Optional[int] = Field(default=10)
