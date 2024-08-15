from datetime import datetime
from typing import Optional

from fastapi import Query
from pydantic import BaseModel, Field, field_validator

from backend.core.constants import EventSortByCode, IndustryCode, JobTypeCode
from backend.schemas.common import PaginationResponse


class ListingEventItem(BaseModel):
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


class SearchEventQueryParams(BaseModel):
    keyword: Optional[str] = Field(Query(default=None))

    # exclude_bookmarks: Optional[bool] = Field(Query(default=False)
    # exclude_applications: Optional[bool] = Field(Query(default=False)
    is_online: Optional[bool] = Field(Query(default=False))
    is_offline: Optional[bool] = Field(Query(default=False))
    is_apply_ongoing: Optional[bool] = Field(Query(default=False))
    is_apply_ended: Optional[bool] = Field(Query(default=False))

    job_type_codes: list[JobTypeCode] = Field(Query(default=None))
    industry_codes: list[IndustryCode] = Field(Query(default=None))
    city_codes: list[str] = Field(Query(default=None))
    tags: list[int] = Field(Query(default=None))

    start_start_at: Optional[datetime] = Field(Query(default=None))
    end_start_at: Optional[datetime] = Field(Query(default=None))

    sort_by: Optional[EventSortByCode] = Field(Query(default=EventSortByCode.PUBLIC_AT))
    per_page: Optional[int] = Field(Query(default=10, le=100, ge=1))
    page: Optional[int] = Field(Query(default=1, ge=1))

    @field_validator(
        "job_type_codes", "industry_codes", "city_codes", "tags", mode="before"
    )
    def check_list_empty(cls, v):
        return v or []


class ListingEventResponse(PaginationResponse[ListingEventItem]):
    pass
