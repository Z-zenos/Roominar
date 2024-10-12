from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import backend.api.v1.services.surveys as survey_service
from backend.api.v1.dependencies.authentication import authorize_role
from backend.core.response import authenticated_api_responses
from backend.db.database import get_read_db
from backend.models.user import RoleCode, User
from backend.schemas.survey import CreateSurveyRequest

router = APIRouter()


@router.post(
    "",
    response_model=int,
    responses=authenticated_api_responses,
)
def create_survey(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    request: CreateSurveyRequest = None,
):
    return survey_service.create_survey(db, organizer, request)


# @router.put(
#     "/{questionnaire_id}",
#     response_model=EditQuestionnaireResponse,
#     responses=authenticated_api_responses,
# )
# def edit_questionnaire(
#     questionnaire_id: int,
#     request: EditQuestionnaireRequest,
#     db: Session = Depends(get_db),
#     user: User = Depends(authorize_role(RoleCode.ORGANIZER)),
# ):
#     questionnaire_id = questionnaire_service.edit_questionnaire(
#         db, user, questionnaire_id, request
#     )
#     return EditQuestionnaireResponse(id=questionnaire_id)


# @router.put(
#     "/{questionnaire_id}/archive",
#     response_model=EditQuestionnaireResponse,
#     responses=authenticated_api_responses,
# )
# def edit_status_questionnaire(
#     questionnaire_id: int,
#     db: Session = Depends(get_db),
#     user: User = Depends(authorize_role(RoleCode.ORGANIZER)),
# ):
#     success = questionnaire_service.archive_questionnaire(db, user, questionnaire_id)
#     if success:
#         return EditQuestionnaireResponse(id=questionnaire_id)


# @router.get(
#     "", response_model=ListQuestionnaireResponse,
#       responses=authenticated_api_responses
# )
# def list_questionnaire(
#     db: Session = Depends(get_db),
#     user: User = Depends(authorize_role(RoleCode.ORGANIZER)),
#     query_params: Annotated[
#         ListQuestionnaireParam, Depends(ListQuestionnaireParam)
#     ] = None,
# ):
#     response = questionnaire_service.list_questionnaire(db, user, query_params)
#     return ListQuestionnaireResponse(**response)


# @router.get("/options", response_model=List[QuestionnaireOption])
# def listing_questionnarie_for_option(
#     db: Session = Depends(get_db),
#     user: User = Depends(authorize_role(RoleCode.ORGANIZER)),
# ):
#     return questionnaire_service.listing_questionnaire_for_option(db, user)


# @router.get(
#     "/{questionnaire_id}",
#     response_model=GetQuestionnaireResponse,
#     responses=authenticated_api_responses,
# )
# def get_questionnaire(
#     questionnaire_id: Annotated[int, Path(...)],
#     db: Annotated[Session, Depends(get_db)],
#     organizer: Annotated[User, Depends(authorize_role(RoleCode.ORGANIZER))],
# ):
#     return questionnaire_service.get_questionnaire(db, organizer, questionnaire_id)


# @router.delete(
#     "/{questionnaire_id}",
#     status_code=HTTPStatus.NO_CONTENT,
#     responses=authenticated_api_responses,
# )
# def delete_questionnaire(
#     questionnaire_id: Annotated[int, Path(...)],
#     db: Annotated[Session, Depends(get_db)],
#     organizer: Annotated[User, Depends(authorize_role(RoleCode.ORGANIZER))],
# ):
#     return questionnaire_service.delete_questionnaire(db, organizer, questionnaire_id)


# @router.patch(
#     "/{questionnaire_id}/unarchive",
#     response_model=EditQuestionnaireResponse,
#     responses=authenticated_api_responses,
# )
# def unarchive_questionnaire(
#     questionnaire_id: int,
#     db: Session = Depends(get_db),
#     user: User = Depends(authorize_role(RoleCode.ORGANIZER)),
# ):
#     success = questionnaire_service.unarchive_questionnaire(
#   db,
#   user,
#   questionnaire_id)
#     if success:
#         return EditQuestionnaireResponse(id=questionnaire_id)


# @router.post(
#     "/{questionnaire_id}/duplicate",
#     response_model=int,
#     responses=authenticated_api_responses,
# )
# def duplicate_questionnaire(
#     questionnaire_id: Annotated[int, Path(...)],
#     db: Annotated[Session, Depends(get_db)],
#     organizer: Annotated[User, Depends(authorize_role(RoleCode.ORGANIZER))],
# ):
#     return questionnaire_service.duplicate_questionnaire(
#         db, organizer, questionnaire_id
#     )
