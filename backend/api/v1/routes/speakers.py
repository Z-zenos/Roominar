from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.api.v1.services.speakers as speakers_service
from backend.core.response import public_api_responses
from backend.db.database import get_read_db
from backend.schemas.speaker import ListingRandomSpeakersResponse

router = APIRouter()


@router.get(
    "/random",
    response_model=ListingRandomSpeakersResponse,
    responses=public_api_responses,
)
async def listing_random_speakers(
    db: Session = Depends(get_read_db),
):
    speakers = await speakers_service.listing_random_speakers(db)
    return ListingRandomSpeakersResponse(
        data=speakers,
        total=4,
        page=1,
        per_page=4,
    )
