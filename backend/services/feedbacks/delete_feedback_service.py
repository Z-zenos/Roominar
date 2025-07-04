from datetime import datetime, timedelta

import pytz
from sqlmodel import Session, delete, func, select, update

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.event import Event
from backend.models.feedback import Feedback
from backend.models.feedback_score import FeedbackScore


async def delete_feedback(
    db: Session,
    feedback_id: int,
):
    feedback = db.exec(select(Feedback).where(Feedback.id == feedback_id)).one_or_none()

    if not feedback:
        raise BadRequestException(
            ErrorCode.ERR_FEEDBACK_NOT_FOUND, ErrorMessage.ERR_FEEDBACK_NOT_FOUND
        )

    if feedback.created_at < datetime.now(pytz.utc) - timedelta(days=7):
        raise BadRequestException(
            ErrorCode.ERR_CANT_DELETE_FEEDBACK, ErrorMessage.ERR_CANT_DELETE_FEEDBACK
        )

    db.exec(
        update(Feedback)
        .where(Feedback.id == feedback.id)
        .values(deleted_at=datetime.now(pytz.utc))
    )
    db.exec(delete(FeedbackScore).where(FeedbackScore.feedback_id == feedback.id))
    db.exec(
        update(Event)
        .where(Event.id == feedback.event_id)
        .values(
            average_rating=db.select(func.avg(FeedbackScore.score)).where(
                FeedbackScore.feedback_id == feedback.id
            ),
            feedback_count=Event.feedback_count - 1,
        )
    )
    db.commit()
