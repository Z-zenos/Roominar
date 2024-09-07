from fastapi import APIRouter, Depends
from sqlmodel import Session

import backend.api.v1.services.tags as tags_service
from backend.core.response import public_api_responses
from backend.db.database import get_read_db
from backend.schemas.tag import ListingTagRankResponse, ListingTagsResponse

router = APIRouter()


@router.get("", response_model=ListingTagsResponse, responses=public_api_responses)
def listing_tags(db: Session = Depends(get_read_db)):
    return ListingTagsResponse(data=tags_service.listing_tags(db))


@router.get(
    "/rank", response_model=ListingTagRankResponse, responses=public_api_responses
)
def listing_tag_rank(db: Session = Depends(get_read_db)):
    return ListingTagRankResponse(tags=tags_service.listing_tag_rank(db))
