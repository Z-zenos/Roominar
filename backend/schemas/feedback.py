from datetime import datetime

from fastapi import Query
from pydantic import BaseModel, Field

from backend.schemas.common import PaginationResponse


class FeedbackRating(BaseModel):
    criteria_id: int
    score: int


class ListingFeedbacksItem(BaseModel):
    id: int
    positive_feedback: str | None = None
    negative_feedback: str | None = None
    created_at: datetime
    updated_at: datetime
    is_anonymous: bool = False
    user_id: int | None = None
    user_name: str | None = None
    user_avatar: str | None = None
    deleted_at: datetime | None = None


class ListingFeedbacksResponse(PaginationResponse[ListingFeedbacksItem]):
    pass


class ListingFeedbacksQueryParams(BaseModel):
    per_page: int | None = Field(Query(default=10, le=100, ge=1))
    page: int | None = Field(Query(default=1, ge=1))


class UpdateFeedbackRequest(BaseModel):
    positive_feedback: str | None = None
    negative_feedback: str | None = None
    ratings: list[FeedbackRating] = Field([])
    is_anonymous: bool = False
