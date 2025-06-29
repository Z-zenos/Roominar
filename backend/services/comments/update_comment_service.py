from sqlmodel import Session, select, update

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.comment import Comment
from backend.models.comment_reply import CommentReply
from backend.models.user import User
from backend.schemas.comment import UpdateEventCommentRequest


async def update_comment(
    db: Session,
    user: User,
    request: UpdateEventCommentRequest,
    comment_id: int,
):
    comment = db.exec(
        select(Comment.__table__.columns, CommentReply.id.label("reply_id"))
        .outerjoin(CommentReply, Comment.id == CommentReply.comment_id)
        .where(Comment.id == comment_id, Comment.user_id == user.id)
    ).one_or_none()

    if not comment:
        raise BadRequestException(
            ErrorCode.ERR_COMMENT_NOT_FOUND, ErrorMessage.ERR_COMMENT_NOT_FOUND
        )

    if comment.reply_id:
        raise BadRequestException(
            ErrorCode.ERR_CANT_UPDATE_COMMENT,
            ErrorMessage.ERR_CANT_UPDATE_COMMENT,
        )

    db.exec(
        update(Comment).where(Comment.id == comment_id).values(content=request.content)
    )
    db.commit()

    return comment.id
