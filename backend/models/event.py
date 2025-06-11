from datetime import datetime
from typing import Optional

from geoalchemy2 import Geography
from pydantic import model_validator
from slugify import slugify
from sqlmodel import (
    ARRAY,
    DOUBLE_PRECISION,
    Column,
    DateTime,
    Enum,
    Field,
    String,
    Text,
)

from backend.core.constants import EventMeetingToolCode, EventStatusCode
from backend.models.base_model import BaseModel
from backend.utils.random import generate_random_string


class Event(BaseModel, table=True):
    __tablename__: str = "events"

    organization_id: Optional[int] = Field(foreign_key="organizations.id")

    name: str = Field(sa_type=String(1024))

    start_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    end_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))

    application_start_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    application_end_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))

    slug: Optional[str] = Field(
        default=None,
        sa_type=String(255),
        nullable=False,
        index=True,
    )

    status: Optional[EventStatusCode] = Field(sa_type=Enum(EventStatusCode))

    total_ticket_number: Optional[int]

    cover_image_url: Optional[str] = Field(sa_type=String(2048))
    gallery: Optional[list[str]] = Field(sa_type=ARRAY(String(2048)))
    description: Optional[str] = Field(sa_type=Text)
    is_online: Optional[bool]
    is_offline: Optional[bool]

    organize_city_code: Optional[str] = Field(sa_type=String(50))
    organize_address: Optional[str] = Field(sa_type=String(255))

    coordinate: Optional[str] = Field(
        sa_column=Column(
            Geography(geometry_type="POINT", srid=4326),
            nullable=True,
        )
    )

    lat: Optional[float] = Field(sa_type=DOUBLE_PRECISION)
    lng: Optional[float] = Field(sa_type=DOUBLE_PRECISION)

    meeting_tool_code: Optional[EventMeetingToolCode] = Field(
        sa_type=Enum(EventMeetingToolCode)
    )
    meeting_url: Optional[str] = Field(sa_type=String(2048))

    survey_id: Optional[int] = Field(
        foreign_key="surveys.id",
    )
    # survey_form_url: Optional[str] = Field(sa_type=String(2048))

    target_id: Optional[int] = Field(foreign_key="targets.id")

    published_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    application_form_url: Optional[str] = Field(sa_type=String(2048))
    view_number: Optional[int] = Field(default=0)
    max_ticket_number_per_account: Optional[int] = Field(default=10)
    min_ticket_price: Optional[float] = Field(default=0.0)

    @model_validator(mode="before")
    @classmethod
    def set_slug(cls, values: dict):
        name = values.get("name")
        slug = values.get("slug")
        if not slug and name:
            slug_base = slugify(name)
            random_part = generate_random_string(8)
            values["slug"] = f"{slug_base}-{random_part}"
        return values
