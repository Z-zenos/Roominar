from http import HTTPStatus

from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.services.comments as comments_service
from backend.core.response import authenticated_api_responses, public_api_responses
from backend.db.database import get_read_db
from backend.dependencies.authentication import authorize_role, get_current_user
from backend.dependencies.comment import get_comment
from backend.models.comment import Comment
from backend.models.user import RoleCode, User
from backend.schemas.comment import (
    CreateCommentReplyRequest,
    ListingCommentRepliesQueryParams,
    ListingCommentRepliesResponse,
    UpdateCommentReplyRequest,
    UpdateEventCommentRequest,
    VoteCommentRequest,
)

router = APIRouter()


@router.get(
    "/{comment_id}/replies",
    response_model=ListingCommentRepliesResponse,
    responses=public_api_responses,
)
async def listing_comment_replies(
    db: Session = Depends(get_read_db),
    comment_id: int = None,
    query_params: ListingCommentRepliesQueryParams = Depends(
        ListingCommentRepliesQueryParams
    ),
):
    replies, total = await comments_service.listing_comment_replies(
        db, comment_id, query_params
    )
    return ListingCommentRepliesResponse(
        data=replies,
        page=1,
        per_page=10,
        total=total,
    )


@router.post(
    "/{comment_id}/replies",
    response_model=int,
    responses=authenticated_api_responses,
)
async def reply_comment(
    db: Session = Depends(get_read_db),
    user: User = Depends(get_current_user),
    comment_id: int = None,
    request: CreateCommentReplyRequest = None,
):
    return await comments_service.reply_comment(db, user, comment_id, request)


@router.post(
    "/{comment_id}/pin",
    response_model=int,
    responses=authenticated_api_responses,
)
async def pin_comment(
    db: Session = Depends(get_read_db),
    user: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    comment_id: int = None,
):
    return await comments_service.handle_pin_comment(db, user, comment_id, True)


@router.post(
    "/{comment_id}/vote",
    response_model=int,
    responses=authenticated_api_responses,
)
async def vote_comment(
    db: Session = Depends(get_read_db),
    user: User = Depends(get_current_user),
    request: VoteCommentRequest = None,
    comment_id: int = None,
):
    return await comments_service.vote_comment(db, user, request, comment_id)


@router.put(
    "/{comment_id}",
    response_model=int,
    responses=authenticated_api_responses,
)
async def update_comment(
    db: Session = Depends(get_read_db),
    user: User = Depends(get_current_user),
    request: UpdateEventCommentRequest = None,
    comment_id: int = None,
):
    return await comments_service.update_comment(db, user, request, comment_id)


@router.put(
    "/replies/{reply_id}",
    response_model=int,
    responses=authenticated_api_responses,
)
async def update_comment_reply(
    db: Session = Depends(get_read_db),
    user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    request: UpdateCommentReplyRequest = None,
    reply_id: int = None,
):
    return await comments_service.update_comment_reply(db, user, request, reply_id)


@router.delete(
    "/{comment_id}",
    status_code=HTTPStatus.NO_CONTENT,
    responses=authenticated_api_responses,
)
async def delete_comment(
    db: Session = Depends(get_read_db),
    comment: Comment = Depends(get_comment),
):
    return await comments_service.delete_comment(db, comment)


@router.delete(
    "/{comment_id}/pin",
    status_code=HTTPStatus.NO_CONTENT,
    responses=authenticated_api_responses,
)
async def unpin_comment(
    db: Session = Depends(get_read_db),
    user: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    comment_id: int = None,
):
    return await comments_service.handle_pin_comment(db, user, comment_id, False)


@router.delete(
    "/replies/{reply_id}",
    status_code=HTTPStatus.NO_CONTENT,
    responses=authenticated_api_responses,
)
async def delete_comment_reply(
    db: Session = Depends(get_read_db),
    reply_id: int = None,
):
    return await comments_service.delete_comment_reply(db, reply_id)
