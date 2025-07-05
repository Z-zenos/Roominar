from sqlmodel import Session, select

from backend.models.feedback_criteria import FeedbackCriteria


async def get_event_feedback_criteria(db: Session, event_id: int):
    criteria = (
        db.exec(
            select(FeedbackCriteria.id, FeedbackCriteria.name).where(
                FeedbackCriteria.event_id == event_id
            )
        )
        .mappings()
        .all()
    )

    return criteria
