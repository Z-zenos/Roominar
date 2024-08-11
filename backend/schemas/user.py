import re
from pydantic import BaseModel, EmailStr
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
