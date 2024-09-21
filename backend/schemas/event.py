from datetime import datetime

from fastapi import Query
from pydantic import BaseModel, Field, field_validator

from backend.core.constants import (
    EventMeetingToolCode,
    EventSortByCode,
    EventStatusCode,
    IndustryCode,
    JobTypeCode,
    MyEventStatusCode,
)
from backend.schemas.common import PaginationResponse
from backend.schemas.questionnaire import QuestionnaireDetail
from backend.schemas.tag import TagItem
from backend.schemas.ticket import TicketItem


class SearchEventsItem(BaseModel):
    id: int
    slug: str
    organization_name: str
    name: str
    start_at: datetime
    end_at: datetime
    application_number: int
    application_start_at: datetime
    application_end_at: datetime
    cover_image_url: str
    organize_city_code: str | None = None
    organize_place_name: str | None = None
    organize_address: str | None = None
    is_online: bool | None = None
    is_offline: bool | None = None
    is_bookmarked: bool | None = None
    meeting_tool_code: str | None = None
    applied_number: int | None = None
    tags: list[TagItem] = Field([])
    published_at: datetime


class SearchEventsQueryParams(BaseModel):
    keyword: str | None = Field(Query(default=None))

    # exclude_bookmarks: bool] = Field(Query(default=False)
    # exclude_applications: bool] = Field(Query(default=False)
    is_online: bool | None = Field(Query(default=False))
    is_offline: bool | None = Field(Query(default=False))
    is_apply_ongoing: bool | None = Field(Query(default=False))
    is_apply_ended: bool | None = Field(Query(default=False))
    is_today: bool | None = Field(Query(default=False))
    is_free: bool | None = Field(Query(default=False))
    is_paid: bool | None = Field(Query(default=False))

    job_type_codes: list[JobTypeCode] = Field(Query(default=None))
    industry_codes: list[IndustryCode] = Field(Query(default=None))
    city_codes: list[str] = Field(Query(default=None))
    tags: list[int] = Field(Query(default=None))

    start_start_at: datetime | None = Field(Query(default=None))
    end_start_at: datetime | None = Field(Query(default=None))

    sort_by: EventSortByCode | None = Field(Query(default=EventSortByCode.PUBLISHED_AT))
    per_page: int | None = Field(Query(default=10, le=100, ge=1))
    page: int | None = Field(Query(default=1, ge=1))

    @field_validator(
        "job_type_codes", "industry_codes", "city_codes", "tags", mode="before"
    )
    def check_list_empty(cls, v):
        return v or []


class SearchEventsResponse(PaginationResponse[SearchEventsItem]):
    pass


class GetEventDetailResponse(BaseModel):
    id: int
    slug: str
    name: str
    cover_image_url: str
    start_at: datetime
    end_at: datetime
    application_start_at: datetime
    application_end_at: datetime
    is_online: bool
    is_offline: bool
    organize_city_code: str | None = None
    organize_place_name: str | None = None
    description: str
    is_bookmarked: bool | None = None
    organization_name: str
    meeting_url: str | None = None
    meeting_tool_code: EventMeetingToolCode
    organization_id: int | None = None
    organization_url: str | None = None
    organization_address: str | None = None
    organization_avatar_url: str | None = None
    organization_description: str | None = None
    tickets: list[TicketItem]
    organization_contact_url: str | None = None
    application_number: int
    applied_number: int
    status: EventStatusCode
    application_form_url: str | None = None
    tags: list[TagItem] = Field([])
    questionnaire: QuestionnaireDetail | None
    view_number: int | None = None


class ListingTopOrganizationEventsItem(BaseModel):
    id: int
    slug: str
    cover_image_url: str | None = None
    name: str
    start_at: datetime


class ListingTopOrganizationEventsResponse(BaseModel):
    events: list[ListingTopOrganizationEventsItem] = Field([])


class ListingRelatedEventsItem(BaseModel):
    id: int
    slug: str
    cover_image_url: str | None = None
    name: str
    start_at: datetime


class ListingRelatedEventsResponse(BaseModel):
    events: list[ListingRelatedEventsItem] = Field([])


class ListingEventRankItem(BaseModel):
    id: int
    slug: str
    name: str


class ListingEventRankResponse(BaseModel):
    events: list[ListingEventRankItem]


class MyEventItem(BaseModel):
    id: int
    slug: str
    organization_name: str
    name: str
    start_at: datetime
    end_at: datetime
    application_start_at: datetime
    application_end_at: datetime
    applied_number: int | None = None
    application_number: int
    application_id: int | None = None
    cover_image_url: str
    organize_place_name: str | None = None
    organize_address: str | None = None
    organize_city_code: str | None = None
    meeting_tool_code: EventMeetingToolCode | None = None
    ticket_name: str | None = None
    is_online: bool | None = None
    is_offline: bool | None = None
    is_applied: bool | None = None
    is_bookmarked: bool | None = None
    published_at: datetime
    tags: list[TagItem] = Field([])


class ListingMyEventsQueryParams(BaseModel):
    keyword: str | None = Field(Query(default=None))
    status: MyEventStatusCode = Field(Query(default=MyEventStatusCode.ALL))
    per_page: int | None = Field(Query(default=10, le=100, ge=1))
    page: int | None = Field(Query(default=1, ge=1))


class ListingMyEventsResponse(PaginationResponse[MyEventItem]):
    pass
