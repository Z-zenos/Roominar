from pydantic import BaseModel, Field


class TagItem(BaseModel):
    id: int | None
    name: str | None
    image_url: str | None = None


class TagGroup(BaseModel):
    group_id: int | None = None
    group_name: str | None = None
    tags: list[TagItem] = Field([])


class ListingTagsResponse(BaseModel):
    data: list[TagGroup] = Field([])


class ListingTagRankResponse(BaseModel):
    tags: list[TagItem] = Field([])
