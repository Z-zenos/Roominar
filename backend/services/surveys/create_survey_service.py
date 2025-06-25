from sqlmodel import Session, select

from backend.core.constants import SurveyStatusCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.survey import Survey
from backend.models.user import User
from backend.schemas.survey import CreateSurveyRequest
from backend.utils.database import transaction_scope

from .create_question_answer_service import create_question_answer


def create_survey(db: Session, organizer: User, request: CreateSurveyRequest):
    """Create a new survey with proper session management"""

    with transaction_scope() as session:
        try:
            # Check if survey name already exists for this organization
            existing_survey = session.exec(
                select(Survey).where(
                    Survey.name == request.name,
                    Survey.organization_id == organizer.organization_id,
                )
            ).first()

            if existing_survey:
                raise BadRequestException(
                    ErrorCode.ERR_SURVEY_NAME_ALREADY_EXISTED,
                    ErrorMessage.ERR_SURVEY_NAME_ALREADY_EXISTED,
                )

            # Create new survey
            new_survey = Survey(
                name=request.name,
                status_code=SurveyStatusCode.OPEN,
                organization_id=organizer.organization_id,
                description=request.description,
                start_at=request.start_at,
                end_at=request.end_at,
                max_response_number=request.max_response_number,
                created_by=organizer.id,
                updated_by=organizer.id,
            )

            session.add(new_survey)
            session.commit()
            session.refresh(new_survey)

            # Create questions and answers for the survey
            create_question_answer(session, request.question_answers, new_survey.id)

            # Invalidate organization-related caches
            from backend.core.simple_cache import invalidate_user_caches

            invalidate_user_caches(organizer.id)

            return new_survey.id

        except BadRequestException:
            raise
        except Exception as e:
            raise BadRequestException(
                ErrorCode.ERR_INTERNAL_SERVER_ERROR,
                f"Failed to create survey: {str(e)}",
            )
