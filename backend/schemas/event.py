from datetime import datetime
from typing import Optional

from fastapi import Query
from pydantic import BaseModel, Field, field_validator

from backend.core.constants import EventSortByCode, IndustryCode, JobTypeCode


class FilterEventsQueryParams(BaseModel):
    keyword: Optional[str] = Field(Query())

    # exclude_bookmarks: Optional[bool] = Field(Query(default=False)
    # exclude_applications: Optional[bool] = Field(Query(default=False)
    is_online: Optional[bool] = Field(Query())
    is_offline: Optional[bool] = Field(Query())
    is_being_accepted: Optional[bool] = Field(Query())
    is_finished: Optional[bool] = Field(Query())

    job_type_codes: Optional[list[JobTypeCode]] = Field(Query(default=[]))
    industry_codes: Optional[list[IndustryCode]] = Field(Query(default=[]))
    city_codes: Optional[list[str]] = Field(Query())
    tags: Optional[list[int]] = Field(Query())

    beginning_starting_period: Optional[datetime] = Field(Query())
    ending_starting_period: Optional[datetime] = Field(Query())

    sort_by: Optional[EventSortByCode] = Field(Query(default=EventSortByCode.PUBLIC_AT))
    per_page: Optional[int] = Field(Query(default=10, le=100, ge=1))
    page: Optional[int] = Field(Query(default=1, ge=1))

    @field_validator(
        "employee_size_codes",
        "job_type_codes",
        "industry_codes",
        "prefecture_codes",
        "tags",
        pre=True,
        always=True,
    )
    def check_list_empty(cls, v):
        return v or []
