from http import HTTPStatus

from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.services.feedbacks as feedbacks_service
from backend.core.response import authenticated_api_responses
from backend.db.database import get_read_db
from backend.dependencies.authentication import get_current_user
from backend.models.user import User
from backend.schemas.feedback import UpdateFeedbackRequest

router = APIRouter()


@router.put(
    "/{feedback_id}",
    response_model=int,
    responses=authenticated_api_responses,
)
async def update_feedback(
    db: Session = Depends(get_read_db),
    user: User = Depends(get_current_user),
    request: UpdateFeedbackRequest = None,
    feedback_id: int = None,
):
    return await feedbacks_service.update_feedback(db, user, request, feedback_id)


@router.delete(
    "/{feedback_id}",
    status_code=HTTPStatus.NO_CONTENT,
    responses=authenticated_api_responses,
)
async def delete_feedback(
    db: Session = Depends(get_read_db),
    feedback_id: int = None,
):
    return await feedbacks_service.delete_feedback(db, feedback_id)
