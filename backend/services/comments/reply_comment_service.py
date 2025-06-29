from sqlmodel import Session, update

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.comment import Comment
from backend.models.comment_reply import CommentReply
from backend.models.user import User
from backend.schemas.comment import CreateCommentReplyRequest


async def reply_comment(
    db: Session,
    user: User,
    comment_id: int,
    request: CreateCommentReplyRequest,
):
    comment = db.get(Comment, comment_id)

    if not comment:
        raise BadRequestException(
            ErrorCode.ERR_COMMENT_NOT_FOUND, ErrorMessage.ERR_COMMENT_NOT_FOUND
        )

    reply = CommentReply(
        comment_id=comment_id,
        user_id=user.id,
        content=request.content,
    )
    db.add(reply)

    db.exec(
        update(Comment)
        .where(Comment.id == comment_id)
        .values(reply_count=comment.reply_count + 1)
    )

    db.commit()
    db.refresh(reply)

    return reply.id
