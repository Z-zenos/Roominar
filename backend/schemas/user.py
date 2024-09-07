from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, ValidationInfo, field_validator

from backend.core.constants import IndustryCode, JobTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.schemas.common import password_validator


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


class RegisterAudienceRequest(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str
    confirm_password: str

    @field_validator("password")
    def password_validator(cls, v):
        return password_validator(v)

    @field_validator("confirm_password")
    def confirm_password_validator(cls, v: Optional[str], values: ValidationInfo):
        if values.data.get("password") != v:
            raise ValueError(
                ErrorCode.ERR_PASSWORD_NOT_MATCHING,
                ErrorMessage.ERR_PASSWORD_NOT_MATCHING,
            )
        return v


class RegisterAudienceResponse(BaseModel):
    email: str
    expire_at: datetime


class VerifyAudienceRequest(BaseModel):
    industry_code: IndustryCode = None
    job_type_code: JobTypeCode = None
    tags: list[int] = Field([])


class VerifyAudienceResponse(UserBase):
    id: int


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


class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    role_code: str


class ForgotPasswordResponse(BaseModel):
    email: EmailStr
    expire_at: datetime
