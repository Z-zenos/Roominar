from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.api.v1.services.tickets as ticket_service
from backend.api.v1.dependencies.authentication import get_current_user
from backend.core.response import authenticated_api_responses
from backend.db.database import get_read_db
from backend.models.user import User
from backend.schemas.ticket import (
    CancelTicketsRequest,
    CreateTicketRequest,
    ListingMyTicketsQueryParams,
    ListingMyTicketsResponse,
)

router = APIRouter()


@router.post("", response_model=int, responses=authenticated_api_responses)
async def create_ticket(
    db: Session = Depends(get_read_db),
    request: CreateTicketRequest = None,
):
    return await ticket_service.create_ticket(db, request)


@router.patch("/cancel", response_model=int, responses=authenticated_api_responses)
async def cancel_tickets(
    db: Session = Depends(get_read_db),
    user: User = Depends(get_current_user),
    request: CancelTicketsRequest = None,
):
    return await ticket_service.cancel_tickets(db, user, request)


@router.get(
    "/my-tickets",
    response_model=ListingMyTicketsResponse,
    responses=authenticated_api_responses,
)
async def listing_my_tickets(
    db: Session = Depends(get_read_db),
    user: User = Depends(get_current_user),
    query_params: ListingMyTicketsQueryParams = Depends(ListingMyTicketsQueryParams),
):
    tickets, total = await ticket_service.listing_my_tickets(db, user, query_params)
    return ListingMyTicketsResponse(
        data=tickets,
        total=total,
        page=query_params.page,
        per_page=query_params.per_page,
    )
