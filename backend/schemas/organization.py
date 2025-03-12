from datetime import datetime

from fastapi import Query
from pydantic import BaseModel, ConfigDict, Field

from backend.core.constants import (
    AttendeeSortByCode,
    IndustryCode,
    JobTypeCode,
    TagStatsCategoryCode,
    TicketStatusCode,
    TicketTypeCode,
    TrackingTimeRangeCode,
    TransactionStatusCode,
    UserActionTypeCode,
)
from backend.schemas.common import PaginationResponse
from backend.schemas.event import SearchEventsItem
from backend.schemas.survey_response_result import AttendeeSurveyResponseResultItem
from backend.schemas.tag import TagItem
from backend.schemas.transaction import AttendeeTicketTransaction


class ListingRandomOrganizationsItem(BaseModel):
    id: int
    slug: str
    name: str
    description: str | None = None
    avatar_url: str | None = None
    tags: list[TagItem] = Field([])
    event_number: int | None = None
    follower_number: int | None = None
    is_followed: bool | None = None


class ListingRandomOrganizationsResponse(
    PaginationResponse[ListingRandomOrganizationsItem]
):
    pass


class ListingAttendeesQueryParams(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    keyword: str | None = Field(
        Query(None, description="user name | event name | phone | email")
    )
    apply_at_from: datetime | None = Field(Query(None))
    apply_at_to: datetime | None = Field(Query(None))
    is_checked_in: bool | None = Field(Query(None))
    job_type_code: JobTypeCode | None = Field(Query(None))
    industry_code: IndustryCode | None = Field(Query(None))
    sort_by: AttendeeSortByCode | None = Field(
        Query(default=AttendeeSortByCode.APPLY_AT)
    )
    per_page: int | None = Field(Query(default=10, le=100, ge=1))
    page: int | None = Field(Query(default=1, ge=1))


class ListingAttendeesItem(BaseModel):
    id: int
    user_name: str
    email: str
    event_id: int
    event_name: str
    job_type_code: JobTypeCode | None = None
    industry_code: IndustryCode | None = None
    workplace_name: str | None = None
    phone: str | None = None
    avatar_url: str | None = None
    applied_at: datetime
    checked_in_at: datetime | None = None
    application_id: int
    transaction_status: TransactionStatusCode | None = None
    check_in_id: int | None = None


class ListingAttendeesResponse(PaginationResponse[ListingAttendeesItem]):
    pass


class DownloadAttendeesRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    keyword: str | None = Field(None)
    apply_at_from: datetime | None = Field(None)
    apply_at_to: datetime | None = Field(None)
    is_checked_in: bool | None = Field(None)
    job_type_code: JobTypeCode | None = Field(None)
    industry_code: IndustryCode | None = Field(None)
    sort_by: AttendeeSortByCode | None = Field(None)
    with_filter: bool | None = Field(None)
    page: int | None = Field(None)
    per_page: int | None = Field(None)


class AttendeeAppliedEvent(BaseModel):
    id: int
    application_id: int
    applied_at: datetime
    name: str
    cover_image_url: str | None = None
    start_at: datetime
    end_at: datetime
    application_start_at: datetime
    application_end_at: datetime
    check_in_id: int | None = None
    checked_in_at: datetime | None = None
    survey_response_results: list[AttendeeSurveyResponseResultItem] = Field([])
    is_bookmarked: bool | None = None
    transaction_histories: list[AttendeeTicketTransaction] = Field([])


class GetAttendeeDetailResponse(BaseModel):
    id: int
    user_name: str
    email: str
    phone: str | None = None
    applied_events: list[AttendeeAppliedEvent] = Field([])
    job_type_code: JobTypeCode | None = None
    industry_code: IndustryCode | None = None
    workplace_name: str | None = None
    avatar_url: str | None = None
    is_followed: bool | None = None


class GetOrganizationDetailResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    avatar_url: str | None = None
    contact_email: str | None = None
    phone: str | None = None
    address: str | None = None
    hp_url: str | None = None
    city_code: str | None = None
    contact_url: str | None = None
    facebook_url: str | None = None

    total_public_events: int | None = None
    follower_number: int | None = None
    is_followed: bool | None = None
    tags: list[TagItem] = Field([])
    events: list[SearchEventsItem] = Field([])


class GetOrganizationDashboardResponse(BaseModel):
    total_events: int | None = None
    ongoing_events: int | None = None
    total_visitors: int | None = None
    total_revenue: int | None = None
    total_members: int | None = None
    total_tickets_sold: int | None = None
    actual_attendees: int | None = None


class TagStatsItem(BaseModel):
    category: TagStatsCategoryCode
    name: str
    usage_count: int


class GetTagStatsResponse(BaseModel):
    data: list[TagStatsItem] = Field([])


class TrackUserActionsQueryParams(BaseModel):
    time_range: TrackingTimeRangeCode = Field(Query(TrackingTimeRangeCode.LAST_7_DAYS))
    group_by: TrackingTimeRangeCode = Field(Query(TrackingTimeRangeCode.LAST_7_DAYS))
    action_types: list[UserActionTypeCode] = Field(
        Query(
            [
                UserActionTypeCode.BOOKMARK,
                UserActionTypeCode.APPLY_EVENT,
                UserActionTypeCode.PURCHASE_TICKET,
            ]
        )
    )
    event_id: int | None = Field(Query(None))
    top_n: int | None = Field(Query(3))


class TrackUserActionsItem(BaseModel):
    action_at: str
    actions: dict[UserActionTypeCode, int]


class TrackUserActionsResponse(BaseModel):
    data: list[TrackUserActionsItem] = Field([])


class GetTicketStatsQueryParams(BaseModel):
    event_id: int | None = Field(Query(None))
    start_date: datetime | None = Field(Query(None))
    end_date: datetime | None = Field(Query(None))
    ticket_type: TicketTypeCode | None = Field(Query(None))
    ticket_status: TicketStatusCode | None = Field(Query(None))


class GetTicketStatsResponse(BaseModel):
    total_sold_tickets: int
    total_remaining_tickets: int
    total_reserved_tickets: int
    sold_percentage: float
    remaining_percentage: float
    reserved_percentage: float
    total_revenue: float
    total_tickets: int
