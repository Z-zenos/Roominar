from typing import Annotated, Generic, List, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationResponse(BaseModel, Generic[T]):
    page: int
    per_page: int
    total: int
    data: Annotated[List[T], Field(None, description="")]
