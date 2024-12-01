from pydantic import BaseModel, Field


class TagItem(BaseModel):
    id: int | None
    name: str | None
    image_url: str | None


class TagGroup(BaseModel):
    group_id: int | None = None
    group_name: str | None = None
    tags: list[TagItem] = Field([])


class ListingTagsResponse(BaseModel):
    data: list[TagGroup] = Field([])


class ListingTagRankResponse(BaseModel):
    tags: list[TagItem] = Field([])


class ListingOngoingEventOrganizationsResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    avatar_url: str | None = None
    tags: list[TagItem] = Field([])
    event_number: int | None = None
    follower_number: int | None = None
