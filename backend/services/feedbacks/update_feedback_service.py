from sqlmodel import Session, delete, func, select, update

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.event import Event
from backend.models.feedback import Feedback
from backend.models.feedback_score import FeedbackScore
from backend.models.user import User
from backend.schemas.feedback import UpdateFeedbackRequest


async def update_feedback(
    db: Session,
    user: User,
    request: UpdateFeedbackRequest,
    feedback_id: int,
):
    try:
        feedback = db.exec(
            select(Feedback.__table__.columns).where(
                Feedback.id == feedback_id, Feedback.user_id == user.id
            )
        ).one_or_none()

        if not feedback:
            raise BadRequestException(
                ErrorCode.ERR_FEEDBACK_NOT_FOUND, ErrorMessage.ERR_FEEDBACK_NOT_FOUND
            )

        db.exec(
            update(Feedback)
            .where(Feedback.id == feedback_id)
            .values(
                positive_feedback=request.positive_feedback,
                negative_feedback=request.negative_feedback,
                is_anonymous=request.is_anonymous,
            )
        )

        db.exec(delete(FeedbackScore).where(FeedbackScore.feedback_id == feedback_id))
        db.commit()

        ratings = [
            FeedbackScore(
                feedback_id=feedback_id,
                criteria_id=rating.criteria_id,
                score=rating.score,
            )
            for rating in request.ratings
        ]
        db.add_all(ratings)
        db.exec(
            update(Event)
            .where(Event.id == feedback.event_id)
            .values(
                average_rating=db.select(func.avg(FeedbackScore.score)).where(
                    FeedbackScore.feedback_id == feedback_id
                ),
            )
        )

        db.commit()

        return feedback_id

    except Exception as e:
        db.rollback()
        raise e
