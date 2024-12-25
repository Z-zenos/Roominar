from datetime import datetime

from fastapi import Query
from pydantic import BaseModel, ConfigDict, Field, ValidationInfo, field_validator

from backend.core.constants import (
    CityCode,
    EventMeetingToolCode,
    EventSortByCode,
    EventStatusCode,
    EventTimeStatusCode,
    IndustryCode,
    JobTypeCode,
    ManageEventSortByCode,
    MyEventStatusCode,
)
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.schemas.common import PaginationResponse
from backend.schemas.survey import SurveyDetail
from backend.schemas.tag import TagItem
from backend.schemas.ticket import TicketItem
from backend.schemas.transaction import TicketTransaction


class SearchEventsItem(BaseModel):
    id: int
    slug: str
    organization_name: str
    name: str
    start_at: datetime
    end_at: datetime
    total_ticket_number: int
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
    sold_tickets_number: int | None = None
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
    total_ticket_number: int
    sold_tickets_number: int | None = None
    status: EventStatusCode
    application_form_url: str | None = None
    tags: list[TagItem] = Field([])
    survey: SurveyDetail | None
    view_number: int | None = None
    is_organization_followed: bool | None = None
    organization_event_number: int | None = None
    organization_follower_number: int | None = None
    max_ticket_number_per_account: int | None = None


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
    total_ticket_number: int
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
    ticket_transactions: list[TicketTransaction] = Field([])
    # canceled_at: datetime | None = None
    sold_tickets_number: int | None = 0


class ListingMyEventsQueryParams(BaseModel):
    keyword: str | None = Field(Query(default=None))
    status: MyEventStatusCode = Field(Query(default=MyEventStatusCode.ALL))
    per_page: int | None = Field(Query(default=10, le=100, ge=1))
    page: int | None = Field(Query(default=1, ge=1))


class ListingMyEventsResponse(PaginationResponse[MyEventItem]):
    pass


# class DraftEventRequest(BaseModel):


class PublishEventRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(max_length=1024)

    start_at: datetime
    end_at: datetime
    application_start_at: datetime
    application_end_at: datetime

    total_ticket_number: int
    cover_image_url: str = Field(max_length=2048)
    gallery: list[str] | None = Field([])

    description: str
    description_image_urls: list[str] | None = Field([])

    is_offline: bool | None
    is_online: bool | None

    organize_place_name: str | None = Field(max_length=255)
    organize_city_code: CityCode | None = Field(max_length=50)
    organize_address: str | None = Field(max_length=255)

    meeting_tool_code: EventMeetingToolCode | None
    meeting_url: str | None = Field(max_length=2048)
    ticket_ids: list[int] | None = Field([])
    survey_id: int | None
    target_id: int
    comment: str | None

    status: EventStatusCode
    tags: list[int] | None = Field([])

    @field_validator("is_online")
    def validate_online_offline(cls, v: str | None, values: ValidationInfo):
        if not v and not values.data.get("is_online"):
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NEIHER_ONLINE_NOR_OFFLINE,
                ErrorMessage.ERR_EVENT_NEIHER_ONLINE_NOR_OFFLINE,
            )
        return v

    @field_validator("organize_place_name", "organize_city_code", "organize_address")
    def validate_offline_address(cls, v: str | None, values: ValidationInfo):
        if values.data.get("is_offline") and not v:
            raise BadRequestException(
                ErrorCode.ERR_OFFLINE_EVENT_MISSING_ADDRESS,
                ErrorMessage.ERR_OFFLINE_EVENT_MISSING_ADDRESS,
            )

        return v

    @field_validator("meeting_tool_code", "meeting_url")
    def validate_online_address(cls, v: str, values: ValidationInfo):
        if values.data.get("is_online") and not v:
            raise BadRequestException(
                ErrorCode.ERR_ONLINE_EVENT_MISSING_ADDRESS,
                ErrorMessage.ERR_ONLINE_EVENT_MISSING_ADDRESS,
            )


class ListingOrganizationEventsQueryParams(BaseModel):
    keyword: str | None = Field(Query(default=None, description=""))
    tags: list[int] = Field(Query(default=None))
    meeting_tool_codes: list[EventMeetingToolCode] = Field(Query(default=[]))

    start_at_from: datetime | None = Field(Query(default=None))
    start_at_to: datetime | None = Field(Query(default=None))
    event_status: list[EventStatusCode] = Field(Query(default=[]))
    time_status: EventTimeStatusCode | None = Field(Query(default=None))

    sort_by: ManageEventSortByCode | None = Field(
        Query(default=ManageEventSortByCode.CREATED_AT)
    )
    per_page: int | None = Field(Query(default=10, le=100, ge=1))
    page: int | None = Field(Query(default=1, ge=1))

    @field_validator("tags", mode="before")
    def check_list_empty(cls, v):
        return v or []


class ListingOrganizationEventsItem(BaseModel):
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
    meeting_url: str | None = None
    meeting_tool_code: EventMeetingToolCode
    # tickets: list[TicketItem] = Field([])
    total_ticket_number: int
    sold_tickets_number: int | None = None
    status: EventStatusCode
    # survey: SurveyDetail | None = None
    view_number: int | None = None
    tags: list[TagItem] = Field([])


class ListingOrganizationEventsResponse(
    PaginationResponse[ListingOrganizationEventsItem]
):
    pass
