from pydantic import BaseModel, Field

from backend.schemas.common import PaginationResponse
from backend.schemas.tag import TagItem


class ListingOngoingEventOrganizationsItem(BaseModel):
    id: int
    name: str
    description: str | None = None
    avatar_url: str | None = None
    tags: list[TagItem] = Field([])
    event_number: int | None = None
    follower_number: int | None = None


class ListingOngoingEventOrganizationsResponse(
    PaginationResponse[ListingOngoingEventOrganizationsItem]
):
    pass
