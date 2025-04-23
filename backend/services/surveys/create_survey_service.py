from sqlmodel import Session, select

from backend.core.constants import SurveyStatusCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.survey import Survey
from backend.models.user import User
from backend.schemas.survey import CreateSurveyRequest
from backend.utils.database import save

from .create_question_answer_service import create_question_answer


async def create_survey(db: Session, organizer: User, request: CreateSurveyRequest):
    try:
        survey = db.exec(
            select(Survey).where(
                Survey.name == request.name,
                Survey.organization_id == organizer.organization_id,
            )
        ).one_or_none()

        if survey:
            raise BadRequestException(
                ErrorCode.ERR_SURVEY_NAME_ALREADY_EXISTED,
                ErrorMessage.ERR_SURVEY_NAME_ALREADY_EXISTED,
            )

        new_survey = Survey(
            name=request.name,
            status_code=SurveyStatusCode.OPEN,
            organization_id=organizer.organization_id,
            description=request.description,
            start_at=request.start_at,
            end_at=request.end_at,
            max_response_number=request.max_response_number,
        )

        survey = save(db, new_survey)

        await create_question_answer(db, request.question_answers, new_survey.id)
        return new_survey.id
    except Exception as e:
        db.rollback()
        raise e
