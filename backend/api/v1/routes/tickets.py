from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.api.v1.services.tickets as ticket_service
from backend.core.response import authenticated_api_responses
from backend.db.database import get_read_db
from backend.schemas.ticket import CreateTicketRequest

router = APIRouter()


@router.post("", response_model=int, responses=authenticated_api_responses)
async def create_ticket(
    db: Session = Depends(get_read_db),
    request: CreateTicketRequest = None,
):
    return await ticket_service.create_ticket(db, request)
