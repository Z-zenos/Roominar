from sqlmodel import Session, func, select

from backend.models.comment_reply import CommentReply
from backend.models.user import User
from backend.schemas.comment import ListingCommentRepliesQueryParams


async def listing_comment_replies(
    db: Session,
    comment_id: int,
    query_params: ListingCommentRepliesQueryParams = None,
):
    query = (
        select(
            CommentReply.id,
            CommentReply.content,
            CommentReply.created_at,
            CommentReply.updated_at,
            CommentReply.user_id,
            func.concat(User.first_name, " ", User.last_name).label("user_name"),
            User.avatar_url.label("user_avatar"),
            User.role_code.label("user_role"),
        )
        .join(User, User.id == CommentReply.user_id)
        .where(CommentReply.comment_id == comment_id)
        .order_by(CommentReply.created_at.desc())
        .offset((query_params.page - 1) * query_params.per_page)
        .limit(query_params.per_page)
    )

    replies = db.exec(query).mappings().all()

    query = select(func.count(CommentReply.id)).where(
        CommentReply.comment_id == comment_id
    )

    return replies, db.scalar(query) or 0
