from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.api.v1.services.applications as application_service
from backend.api.v1.dependencies.authentication import authorize_role
from backend.core.constants import RoleCode
from backend.core.response import public_api_responses
from backend.db.database import get_read_db
from backend.models.user import User
from backend.schemas.application import CreateApplicationRequest

router = APIRouter()


@router.post("/{event_id}", response_model=int, responses=public_api_responses)
async def create_application(
    event_id: int,
    request: CreateApplicationRequest,
    current_user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    db: Session = Depends(get_read_db),
):
    return await application_service.create_application(
        db,
        request,
        current_user,
        event_id,
    )


# @router.delete(
#     "/{application_id}",
#     status_code=HTTPStatus.NO_CONTENT,
#     responses=authenticated_api_responses,
# )
# def delete_application(
#     application_id: int,
#     user: Annotated[User, Depends(get_current_user)],
#     db: Session = Depends(get_db),
# ):
#     return application_service.delete_application(db, user, application_id)
