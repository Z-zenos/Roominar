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
from backend.schemas.target import ListingTargetOptionsItem
from backend.schemas.ticket import OrganizationEventTicketItem, TicketItem
from backend.schemas.transaction import MyTicketTransaction


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

    start_at_from: datetime | None = Field(Query(default=None))
    start_at_to: datetime | None = Field(Query(default=None))

    organization_id: int | None = Field(Query(default=None))

    sort_by: EventSortByCode | None = Field(Query(default=EventSortByCode.PUBLISHED_AT))
    per_page: int | None = Field(Query(default=10, le=100, ge=1))
    page: int | None = Field(Query(default=1, ge=1))

    @field_validator(
        "job_type_codes", "industry_codes", "city_codes", "tags", mode="before"
    )
    def check_list_empty(cls, v):
        return v or []

    @classmethod
    def create(cls, **kwargs):
        """Factory method to initialize with real values, allowing overrides"""
        default_values = {
            "keyword": None,
            "is_online": False,
            "is_offline": False,
            "is_apply_ongoing": False,
            "is_apply_ended": False,
            "is_today": False,
            "is_free": False,
            "is_paid": False,
            "job_type_codes": [],
            "industry_codes": [],
            "city_codes": [],
            "tags": [],
            "start_at_from": None,
            "start_at_to": None,
            "organization_id": None,
            "sort_by": "PUBLISHED_AT",
            "per_page": 10,
            "page": 1,
        }
        # Update default values with any parameters passed
        default_values.update(kwargs)
        return cls(**default_values)


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
    transaction_histories: list[MyTicketTransaction] = Field([])
    # canceled_at: datetime | None = None
    # sold_tickets_number: int | None = 0


class ListingMyEventsQueryParams(BaseModel):
    keyword: str | None = Field(Query(default=None))
    status: MyEventStatusCode = Field(Query(default=MyEventStatusCode.ALL))
    per_page: int | None = Field(Query(default=10, le=100, ge=1))
    page: int | None = Field(Query(default=1, ge=1))


class ListingMyEventsResponse(PaginationResponse[MyEventItem]):
    pass


class PublishEventRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(max_length=1024)

    start_at: datetime
    end_at: datetime
    application_start_at: datetime
    application_end_at: datetime

    total_ticket_number: int
    cover_image_url: str = Field(max_length=2048)
    gallery: list[str] = Field([])

    description: str
    # description_image_urls: list[str] | None = Field([])

    is_offline: bool | None
    is_online: bool | None

    organize_city_code: CityCode | None = Field(max_length=50)
    organize_address: str | None = Field(max_length=255)

    meeting_tool_code: EventMeetingToolCode | None
    meeting_url: str | None = Field(max_length=2048)
    ticket_ids: list[int] = Field([])
    survey_id: int | None
    target_id: int | None
    comment: str | None

    tags: list[int] = Field([])

    @field_validator("is_online")
    def validate_online_offline(cls, v: str | None, values: ValidationInfo):
        if not v and not values.data.get("is_online"):
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NEIHER_ONLINE_NOR_OFFLINE,
                ErrorMessage.ERR_EVENT_NEIHER_ONLINE_NOR_OFFLINE,
            )
        return v

    @field_validator("organize_city_code", "organize_address")
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
    cover_image_url: str | None
    start_at: datetime | None
    end_at: datetime | None
    application_start_at: datetime | None
    application_end_at: datetime | None
    is_online: bool | None
    is_offline: bool | None
    organize_city_code: str | None
    organize_address: str | None
    meeting_url: str | None = None
    meeting_tool_code: EventMeetingToolCode | None
    tickets: list[OrganizationEventTicketItem] = Field([])
    total_ticket_number: int | None
    status: EventStatusCode
    # survey: SurveyDetail | None = None
    view_number: int | None = None
    tags: list[TagItem] = Field([])


class ListingOrganizationEventsResponse(
    PaginationResponse[ListingOrganizationEventsItem]
):
    pass


class CreateDraftEventRequest(BaseModel):
    event_id: int | None = None


class GetDraftEventResponse(BaseModel):
    id: int
    slug: str
    name: str
    start_at: datetime | None = None
    end_at: datetime | None = None
    application_start_at: datetime | None = None
    application_end_at: datetime | None = None
    cover_image_url: str | None = None
    gallery: list[str] = Field([])
    is_online: bool | None = None
    is_offline: bool | None = None
    organize_address: str | None = None
    organize_city_code: str | None = None
    description: str | None = None
    meeting_url: str | None = None
    meeting_tool_code: EventMeetingToolCode | None = None
    tickets: list[TicketItem] = Field([])
    total_ticket_number: int | None = None
    status: EventStatusCode | None = None
    application_form_url: str | None = None
    tags: list[TagItem] = Field([])
    target: ListingTargetOptionsItem | None = None
    survey_id: int | None = None
    max_ticket_number_per_account: int | None = None
    comment: str | None = None


class SaveDraftEventRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str | None = Field(max_length=1024)

    start_at: datetime | None
    end_at: datetime | None
    application_start_at: datetime | None
    application_end_at: datetime | None

    total_ticket_number: int | None = Field(le=1000)
    cover_image_url: str | None = Field(max_length=2048)
    gallery: list[str] = Field([])

    description: str | None

    is_offline: bool | None
    organize_city_code: CityCode | None = Field(max_length=50)
    organize_address: str | None = Field(max_length=255)

    is_online: bool | None
    meeting_tool_code: EventMeetingToolCode | None
    meeting_url: str | None = Field(max_length=2048)

    ticket_ids: list[int] = Field([])
    survey_id: int | None
    target_id: int | None
    comment: str | None
    tags: list[int] = Field([])


class ListingOrganizationEventsTimelineItem(BaseModel):
    id: int
    slug: str
    name: str
    start_at: datetime | None
    end_at: datetime | None
    application_start_at: datetime | None
    application_end_at: datetime | None
    is_online: bool | None
    is_offline: bool | None


class ListingRecommendationEventsResponse(PaginationResponse[SearchEventsItem]):
    pass
