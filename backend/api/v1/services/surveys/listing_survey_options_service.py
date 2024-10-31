from sqlmodel import Session, desc, func, select

from backend.models import Survey, User
from backend.models.question import Question


async def listing_survey_options(db: Session, organizer: User):
    survey_options = (
        db.exec(
            select(
                Survey.id,
                Survey.name,
                func.count(Question.id).label("question_number"),
            )
            .where(Survey.organization_id == organizer.organization_id)
            .outerjoin(Question, Question.survey_id == Survey.id)
            .group_by(Survey.id)
            .order_by(desc(Survey.created_at))
        )
        .mappings()
        .all()
    )

    return survey_options
