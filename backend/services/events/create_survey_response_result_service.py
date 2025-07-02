from sqlmodel import Session, select

from backend.core.constants import UserActionTypeCode
from backend.models.application import Application
from backend.models.event import Event
from backend.models.survey_response_result import SurveyResponseResult
from backend.models.user import User
from backend.models.user_action import UserAction
from backend.schemas.survey_response_result import CreateSurveyResponseResultRequest
from backend.utils.database import save


async def create_survey_response_result(
    db: Session,
    user: User,
    event_id: int,
    request: CreateSurveyResponseResultRequest,
) -> int:
    try:
        event = db.get(Event, event_id)

        application = db.exec(
            select(Application).where(
                Application.event_id == event_id,
                Application.user_id == user.id,
            )
        ).one_or_none()

        if request.survey_response_results:
            survey_responses = [
                SurveyResponseResult(
                    event_id=event_id,
                    application_id=application.id,
                    email=user.email,
                    question_id=srr["question_id"],
                    answers_ids=srr["answers_ids"],
                    answer_text=srr.get("answer_text"),
                )
                for srr in request.survey_response_results
            ]
            user_action = UserAction(
                user_id=user.id,
                event_id=event_id,
                organization_id=event.organization_id,
                action_type=UserActionTypeCode.ANSWER_APPLICATION_SURVEY,
            )
            db.bulk_save_objects(survey_responses)
            save(db, user_action)

        return 1

    except Exception as e:
        db.rollback()
        raise e
