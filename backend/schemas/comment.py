from datetime import datetime

from fastapi import Query
from pydantic import BaseModel, Field

from backend.core.constants import VoteTypeCode
from backend.schemas.common import PaginationResponse


class ListingEventCommentsItem(BaseModel):
    id: int
    content: str
    created_at: datetime
    updated_at: datetime
    user_id: int | None = None
    user_name: str | None = None
    user_avatar: str | None = None
    reply_count: int | None = None
    upvote_count: int | None = None
    downvote_count: int | None = None
    is_pinned: bool
    vote_type: VoteTypeCode | None = None
    deleted_at: datetime | None = None


class ListingEventCommentsResponse(PaginationResponse[ListingEventCommentsItem]):
    pass


class ListingEventCommentsQueryParams(BaseModel):
    per_page: int | None = Field(Query(default=10, le=100, ge=1))
    page: int | None = Field(Query(default=1, ge=1))


class CommentEventRequest(BaseModel):
    content: str


class ListingCommentRepliesItem(BaseModel):
    id: int
    content: str
    created_at: datetime
    updated_at: datetime
    user_id: int | None = None
    user_name: str | None = None
    user_avatar: str | None = None
    user_role: str | None = None


class ListingCommentRepliesResponse(PaginationResponse[ListingCommentRepliesItem]):
    pass


class UpdateEventCommentRequest(BaseModel):
    content: str


class CreateCommentReplyRequest(BaseModel):
    content: str


class UpdateCommentReplyRequest(BaseModel):
    content: str


class VoteCommentRequest(BaseModel):
    vote_type: VoteTypeCode
