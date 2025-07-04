from sqlmodel import Session, func, select

from backend.models.feedback import Feedback
from backend.models.user import User
from backend.schemas.feedback import ListingFeedbacksQueryParams


async def listing_feedbacks(
    db: Session,
    user: User,
    query_params: ListingFeedbacksQueryParams,
    event_id: int,
):
    feedbacks = await _get_all_feedbacks(db, user, query_params, event_id)
    total = await _count_total_feedbacks(db, event_id)

    return feedbacks, total


async def _get_all_feedbacks(
    db: Session,
    user: User,
    query_params: ListingFeedbacksQueryParams,
    event_id: int,
):
    query = (
        select(
            Feedback.id,
            Feedback.positive_feedback,
            Feedback.negative_feedback,
            Feedback.is_anonymous,
            Feedback.created_at,
            Feedback.updated_at,
            Feedback.user_id,
            func.concat(User.first_name, " ", User.last_name).label("user_name"),
            User.avatar_url.label("user_avatar"),
            Feedback.deleted_at,
        )
        .outerjoin(User, User.id == Feedback.user_id)
        .where(Feedback.event_id == event_id)
        .order_by(Feedback.created_at.desc())
        .offset((query_params.page - 1) * query_params.per_page)
        .limit(query_params.per_page)
    )

    feedbacks = db.exec(query).mappings().all()

    return feedbacks


async def _count_total_feedbacks(
    db: Session,
    event_id: int,
):
    query = select(func.count(Feedback.id)).where(Feedback.event_id == event_id)
    return db.scalar(query) or 0
