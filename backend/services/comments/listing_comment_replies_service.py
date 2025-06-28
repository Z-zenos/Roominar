from sqlmodel import Session, select

from backend.models.comment_reply import CommentReply
from backend.utils.database import fetch_all


async def listing_comment_replies(
    db: Session,
    comment_id: int,
):
    replies = fetch_all(
        db, select(CommentReply).where(CommentReply.comment_id == comment_id)
    )

    return replies
