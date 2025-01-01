from datetime import datetime

from fastapi import Query
from pydantic import BaseModel, ConfigDict, Field

from backend.core.constants import (
    AttendeeSortByCode,
    IndustryCode,
    JobTypeCode,
    TransactionStatusCode,
)
from backend.schemas.common import PaginationResponse
from backend.schemas.tag import TagItem


class ListingOngoingEventOrganizationsItem(BaseModel):
    id: int
    name: str
    description: str | None = None
    avatar_url: str | None = None
    tags: list[TagItem] = Field([])
    event_number: int | None = None
    follower_number: int | None = None
    is_followed: bool | None = None


class ListingOngoingEventOrganizationsResponse(
    PaginationResponse[ListingOngoingEventOrganizationsItem]
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
    transaction_status: TransactionStatusCode
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
