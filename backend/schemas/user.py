from pydantic import BaseModel, EmailStr, Field, field_validator

from backend.core.constants import IndustryCode, JobTypeCode
from backend.schemas.tag import TagItem


class UserBase(BaseModel):
    id: int | None = None
    organization_id: int | None = None
    role_code: str | None = None
    email: EmailStr | None = None
    first_name: str | None = None
    last_name: str | None = None
    workplace_name: str | None = None
    phone: str | None = None
    address: str | None = None
    city_code: str | None = None
    industry_code: str | None = None
    job_type_code: str | None = None
    avatar_url: str | None = None
    tags: list[TagItem] = Field([])


class UpdateUserRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    workplace_name: str | None = None
    phone: str | None = None
    city_code: str | None = None
    address: str | None = None
    industry_code: IndustryCode | None = None
    job_type_code: JobTypeCode | None = None
    tags: list[int] = Field([])

    @field_validator("tags")
    def check_tags_length(cls, v):
        if v is not None and len(v) > 10:
            raise ValueError("Tags can have at most 10 items")
        return v
