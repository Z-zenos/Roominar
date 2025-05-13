from pydantic import BaseModel, Field

from backend.schemas.common import PaginationResponse


class ListingRandomSpeakersItem(BaseModel):
    id: int
    first_name: str | None = None
    last_name: str | None = None
    avatar_url: str | None = None
    industry_code: str | None = None
    job_type_code: str | None = None
    slug: str = None


class ListingRandomSpeakersResponse(PaginationResponse[ListingRandomSpeakersItem]):
    pass


class GetSpeakerDetailResponse(BaseModel):
    id: int
    first_name: str | None = None
    last_name: str | None = None
    avatar_url: str | None = None
    industry_code: str | None = None
    job_type_code: str | None = None
    slug: str = None
    email: str | None = None
    phone: str | None = None
    skills: list[str] = Field([])
    description: str | None = None
    facebook_url: str | None = None
    twitter_url: str | None = None
    linkedin_url: str | None = None
    youtube_url: str | None = None
