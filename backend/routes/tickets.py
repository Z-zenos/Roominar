from http import HTTPStatus

from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.services.tickets as ticket_service
from backend.core.constants import RoleCode
from backend.core.response import authenticated_api_responses
from backend.db.database import get_read_db
from backend.dependencies.authentication import authorize_role
from backend.models.ticket import Ticket
from backend.models.user import User
from backend.schemas.ticket import (
    CancelTicketsRequest,
    CreateTicketRequest,
    TicketItem,
    UpdateTicketRequest,
)

router = APIRouter()


@router.post("", response_model=int, responses=authenticated_api_responses)
async def create_ticket(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    request: CreateTicketRequest = None,
):
    return await ticket_service.create_ticket(db, organizer, request)


@router.patch("/cancel", response_model=int, responses=authenticated_api_responses)
async def cancel_tickets(
    db: Session = Depends(get_read_db),
    user: User = Depends(authorize_role(RoleCode.AUDIENCE)),
    request: CancelTicketsRequest = None,
):
    return await ticket_service.cancel_tickets(db, user, request)


@router.patch(
    "/{ticket_id}", response_model=TicketItem, responses=authenticated_api_responses
)
async def update_ticket(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    request: UpdateTicketRequest = None,
    ticket_id: int = None,
):
    return await ticket_service.update_ticket(db, organizer, request, ticket_id)


@router.get(
    "/{ticket_id}/draft", response_model=Ticket, responses=authenticated_api_responses
)
async def get_draft_ticket(
    db: Session = Depends(get_read_db),
    ticket_id: int = None,
):
    return await ticket_service.get_draft_ticket(db, ticket_id)


@router.delete(
    "/{ticket_id}",
    status_code=HTTPStatus.NO_CONTENT,
    responses=authenticated_api_responses,
)
async def delete_ticket(
    db: Session = Depends(get_read_db),
    organizer: User = Depends(authorize_role(RoleCode.ORGANIZER)),
    ticket_id: int = None,
):
    return await ticket_service.delete_ticket(db, organizer, ticket_id)
