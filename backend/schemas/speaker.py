from pydantic import BaseModel

from backend.schemas.common import PaginationResponse


class ListingRandomSpeakersItem(BaseModel):
    id: int
    first_name: str | None = None
    last_name: str | None = None
    avatar_url: str | None = None
    industry_code: str | None = None
    job_type_code: str | None = None


class ListingRandomSpeakersResponse(PaginationResponse[ListingRandomSpeakersItem]):
    pass
