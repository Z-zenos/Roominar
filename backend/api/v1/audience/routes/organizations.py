from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.api.v1.audience.services.events as events_service
from backend.core.response import public_api_responses
from backend.db.database import get_read_db
from backend.schemas.event import ListingTopOrganizationEventsResponse

router = APIRouter()


@router.get(
    "/{organization_id}/top-events",
    response_model=ListingTopOrganizationEventsResponse,
    responses=public_api_responses,
)
def listing_top_organization_events(
    organization_id: int = None,
    db: Session = Depends(get_read_db),
):
    events = events_service.listing_top_organization_events(db, organization_id)
    return ListingTopOrganizationEventsResponse(events=events)
