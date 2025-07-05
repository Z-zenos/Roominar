from datetime import datetime

import pytz
from sqlmodel import Session, select, update

from backend.core.constants import UserActionTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.event import Event
from backend.models.feedback import Feedback
from backend.models.feedback_score import FeedbackScore
from backend.models.transaction import Transaction
from backend.models.transaction_item import TransactionItem
from backend.models.user import User
from backend.models.user_action import UserAction
from backend.schemas.event import FeedbackEventRequest


async def feedback_event(
    db: Session,
    user: User,
    request: FeedbackEventRequest = None,
    event_id=None,
):
    try:
        feedback = db.exec(
            select(Feedback).where(
                Feedback.event_id == event_id,
                Feedback.user_id == user.id,
            )
        ).first()

        if feedback:
            raise BadRequestException(
                ErrorCode.ERR_FEEDBACK_ALREADY_EXISTS,
                ErrorMessage.ERR_FEEDBACK_ALREADY_EXISTS,
            )

        transaction_item = db.exec(
            select(TransactionItem)
            .join(Transaction, TransactionItem.transaction_id == Transaction.id)
            .where(
                TransactionItem.user_id == user.id,
                Transaction.event_id == event_id,
            )
        ).one_or_none()

        if not transaction_item:
            raise BadRequestException(
                ErrorCode.ERR_USER_HAVENT_PURCHASEED_TICKET_YET,
                ErrorMessage.ERR_USER_HAVENT_PURCHASEED_TICKET_YET,
            )

        event = db.get(Event, event_id)

        if event.start_at > datetime.now(pytz.utc):
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NOT_STARTED,
                ErrorMessage.ERR_EVENT_NOT_STARTED,
            )

        if event.end_at > datetime.now(pytz.utc) and event.start_at < datetime.now(
            pytz.utc
        ):
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NOT_ENDED,
                ErrorMessage.ERR_EVENT_NOT_ENDED,
            )

        feedback = Feedback(
            event_id=event_id,
            user_id=user.id,
            positive_feedback=request.positive_feedback,
            negative_feedback=request.negative_feedback,
            is_anonymous=request.is_anonymous,
        )
        db.add(feedback)
        db.commit()
        db.refresh(feedback)

        ratings = [
            FeedbackScore(
                feedback_id=feedback.id,
                criteria_id=rating.criteria_id,
                score=rating.score,
            )
            for rating in request.ratings
        ]
        user_action = UserAction(
            user_id=user.id,
            event_id=event_id,
            organization_id=event.organization_id,
            action_type=UserActionTypeCode.FEEDBACK,
        )
        db.add(user_action)
        db.add_all(ratings)

        db.exec(
            update(Event)
            .where(Event.id == event_id)
            .values(feedback_count=Event.feedback_count + 1)
        )

        db.commit()

        return feedback.id

    except Exception as e:
        db.rollback()
        raise e
