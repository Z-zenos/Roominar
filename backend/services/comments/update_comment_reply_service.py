from sqlmodel import Session, select, update

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.comment_reply import CommentReply
from backend.models.user import User
from backend.schemas.comment import UpdateCommentReplyRequest


async def update_comment_reply(
    db: Session,
    user: User,
    request: UpdateCommentReplyRequest,
    reply_id: int,
):
    reply = db.exec(
        select(CommentReply).where(
            CommentReply.id == reply_id, CommentReply.user_id == user.id
        )
    ).one_or_none()

    if not reply:
        raise BadRequestException(
            ErrorCode.ERR_COMMENT_NOT_FOUND, ErrorMessage.ERR_COMMENT_NOT_FOUND
        )

    db.exec(
        update(CommentReply)
        .where(CommentReply.id == reply_id)
        .values(content=request.content)
    )
    db.commit()

    return reply.id
