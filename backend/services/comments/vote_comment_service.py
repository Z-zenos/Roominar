from sqlmodel import Session, select, update

from backend.core.constants import VoteTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.comment import Comment
from backend.models.comment_vote import CommentVote
from backend.models.user import User
from backend.schemas.comment import VoteCommentRequest


async def vote_comment(
    db: Session,
    user: User,
    request: VoteCommentRequest,
    comment_id: int,
):
    comment = db.get(Comment, comment_id)

    if not comment:
        raise BadRequestException(
            ErrorCode.ERR_COMMENT_NOT_FOUND, ErrorMessage.ERR_COMMENT_NOT_FOUND
        )

    if comment.deleted_at:
        raise BadRequestException(
            ErrorCode.ERR_CANT_VOTE_COMMENT, ErrorMessage.ERR_CANT_VOTE_COMMENT
        )

    if comment.user_id == user.id:
        raise BadRequestException(
            ErrorCode.ERR_CANT_SELF_VOTE_COMMENT,
            ErrorMessage.ERR_CANT_SELF_VOTE_COMMENT,
        )

    comment_vote = db.exec(
        select(CommentVote).where(
            CommentVote.comment_id == comment_id, CommentVote.user_id == user.id
        )
    ).one_or_none()

    vote_count = comment.vote_count

    if not comment_vote:
        comment_vote = CommentVote(
            comment_id=comment_id,
            user_id=user.id,
            vote_type=request.vote_type,
        )
        db.add(comment_vote)

    else:
        if comment_vote.vote_type == request.vote_type:
            raise BadRequestException(
                ErrorCode.ERR_CANT_VOTE_COMMENT, ErrorMessage.ERR_CANT_VOTE_COMMENT
            )

        db.exec(
            update(CommentVote)
            .where(CommentVote.comment_id == comment_id, CommentVote.user_id == user.id)
            .values(vote_type=request.vote_type)
        )

    if request.vote_type == VoteTypeCode.UPVOTE:
        vote_count += 1
    else:
        vote_count -= 1

    db.exec(
        update(Comment).where(Comment.id == comment_id).values(vote_count=vote_count)
    )
    db.commit()

    return comment.id
