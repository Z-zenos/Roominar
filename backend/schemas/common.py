import re
from typing import Annotated, Generic, List, TypeVar

from pydantic import BaseModel, Field

from backend.core.constants import IndustryCode, JobTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage

T = TypeVar("T")


class PaginationResponse(BaseModel, Generic[T]):
    page: int
    per_page: int
    total: int
    data: Annotated[List[T], Field(None, description="")]


def phone_validator(v):
    if not re.match("^[0-9]*$", v) or len(v) != 11:
        raise ValueError(ErrorCode.ERR_INVALID_PHONE, ErrorMessage.ERR_INVALID_PHONE)
    return v


def industry_code_validator(v):
    if v not in [ic.value for ic in IndustryCode]:
        raise ValueError(
            ErrorCode.ERR_INVALID_INDUSTRY_CODE, ErrorMessage.ERR_INVALID_INDUSTRY_CODE
        )
    return v


def job_type_code_validator(v):
    if v not in [jtc.value for jtc in JobTypeCode]:
        raise ValueError(
            ErrorCode.ERR_INVALID_JOB_TYPE_CODE, ErrorMessage.ERR_INVALID_JOB_TYPE_CODE
        )
    return v


def password_validator(v):
    if len(v) < 8:
        raise ValueError(
            ErrorCode.ERR_INVALID_PASSWORD, ErrorMessage.ERR_INVALID_PASSWORD
        )
    pattern = r"^[!-~]+$"
    if not re.match(pattern, v):
        raise ValueError(
            ErrorCode.ERR_INVALID_PASSWORD, ErrorMessage.ERR_INVALID_PASSWORD
        )
    return v


def hp_url_validator(v):
    if not v.startswith("http"):
        raise ValueError(ErrorCode.ERR_INVALID_URL, ErrorMessage.ERR_INVALID_URL)
    return v
