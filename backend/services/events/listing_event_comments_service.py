from sqlmodel import Session, and_, func, select

from backend.models.comment import Comment
from backend.models.comment_vote import CommentVote
from backend.models.user import User
from backend.schemas.comment import ListingEventCommentsQueryParams


async def listing_event_comments(
    db: Session,
    user: User,
    query_params: ListingEventCommentsQueryParams,
    event_id: int,
):
    comments = await _get_all_event_comments(db, user, query_params, event_id)
    total = await _get_event_comment_total(db, event_id)

    return comments, total


async def _get_all_event_comments(
    db: Session,
    user: User,
    query_params: ListingEventCommentsQueryParams,
    event_id: int,
):
    query = (
        select(
            Comment.id,
            Comment.content,
            Comment.created_at,
            Comment.updated_at,
            Comment.user_id,
            func.concat(User.first_name, " ", User.last_name).label("user_name"),
            User.avatar_url.label("user_avatar"),
            Comment.reply_count,
            Comment.vote_count,
            Comment.is_pinned,
            Comment.deleted_at,
        )
        .outerjoin(User, User.id == Comment.user_id)
        .where(Comment.event_id == event_id, Comment.deleted_at.is_(None))
        .order_by(Comment.is_pinned.desc(), Comment.created_at.desc())
        .offset((query_params.page - 1) * query_params.per_page)
        .limit(query_params.per_page)
    )

    if user:
        query = query.add_columns(CommentVote.vote_type.label("vote_type")).outerjoin(
            CommentVote,
            and_(CommentVote.comment_id == Comment.id, CommentVote.user_id == user.id),
        )

    comments = db.exec(query).mappings().all()

    return comments


async def _get_event_comment_total(
    db: Session,
    event_id: int,
):
    query = select(func.count(Comment.id)).where(Comment.event_id == event_id)
    return db.scalar(query) or 0
