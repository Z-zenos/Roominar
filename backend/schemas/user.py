import re
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, ValidationInfo, field_validator

from backend.core.constants import IndustryCode, JobTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage


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


class VerifyRegisterAudienceResponse(UserBase):
    pass


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


def company_url_validator(v):
    if not v.startswith("http"):
        raise ValueError(
            ErrorCode.ERR_INVALID_COMPANY_URL, ErrorMessage.ERR_INVALID_COMPANY_URL
        )
    return v


def phone_validator(v):
    if not re.match("^[0-9]*$", v) or len(v) != 11:
        raise ValueError(ErrorCode.ERR_INVALID_PHONE, ErrorMessage.ERR_INVALID_PHONE)
    return v


# def prefecture_code_validator(v):
#     if v not in ValidCode.VALID_PREFECTURE_CODES:
#         raise ValueError(ErrorCode.ERR_INVALID_PREFECTURE_CODE)
#     return v


# def industry_code_validator(v):
#     if v not in ValidCode.VALID_INDUSTRY_CODES:
#         raise ValueError(ErrorCode.ERR_INVALID_INDUSTRY_CODE)
#     return v


# def employee_size_code_validator(v):
#     if v not in ValidCode.VALID_EMPLOYEE_SIZE_CODES:
#         raise ValueError(ErrorCode.ERR_INVALID_EMPLOYEE_SIZE_CODE)
#     return v


# def revenue_validator(v):
#     if v not in ValidCode.VALID_REVENUE_CODES:
#         raise ValueError(ErrorCode.ERR_INVALID_REVENUE_CODE)
#     return v


# def job_type_code_validator(v):
#     if v not in ValidCode.VALID_JOB_TYPE_CODES:
#         raise ValueError(ErrorCode.ERR_INVALID_JOB_TYPE_CODE)
#     return v


# def position_code_validator(v):
#     if v not in ValidCode.VALID_POSITION_CODES:
#         raise ValueError(ErrorCode.ERR_INVALID_POSITION_CODE)
#     return v


def password_validator(v):
    if len(v) < 8:
        raise ValueError(
            ErrorCode.ERR_INVALID_PASSWORD, ErrorMessage.ERR_INVALID_PASSWORD
        )
    pattern = r"^[!-~]+$"
    if not re.match(pattern, v):
        raise ValueError(
            ErrorCode.ERR_INVALID_PASSWORD, ErrorMessage.ERR_INVALID_PASSWORD_WIDTH
        )
    return v


def hp_url_validator(v):
    if not v.startswith("http"):
        raise ValueError(ErrorCode.ERR_INVALID_URL, ErrorMessage.ERR_INVALID_URL)
    return v
