from sqlmodel import Session, select, update

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.comment import Comment


async def handle_pin_comment(
    db: Session,
    comment_id: int,
    is_pinned: bool,
):
    comment = db.exec(select(Comment).where(Comment.id == comment_id)).one_or_none()

    if not comment:
        raise BadRequestException(
            ErrorCode.ERR_COMMENT_NOT_FOUND, ErrorMessage.ERR_COMMENT_NOT_FOUND
        )

    db.exec(update(Comment).where(Comment.id == comment_id).values(is_pinned=is_pinned))
    db.commit()

    return comment.id
