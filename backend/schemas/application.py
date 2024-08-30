from typing import Optional

from pydantic import BaseModel, EmailStr, Field, ValidationInfo, field_validator

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.schemas.common import (
    industry_code_validator,
    job_type_code_validator,
    password_validator,
)
from backend.schemas.question_answer_result import QuestionAnswerResultItem


class CreateApplicationRequest(BaseModel):
    email: EmailStr
    first_name: str = Field(max_length=255)
    last_name: str = Field(max_length=255)
    workplace_name: str = Field(max_length=255)
    phone: str = Field(max_length=20)
    industry_code: str = Field(max_length=50)
    job_type_code: str = Field(max_length=20)
    question_answer_results: list[QuestionAnswerResultItem] = Field([])
    ticket_id: int
    is_agreed: bool
    password: Optional[str]
    confirm_password: Optional[str]

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

    @field_validator(
        "first_name",
        "last_name",
        "workplace_name",
    )
    def validate_empty(cls, v):
        if not v.strip():
            raise ValueError("Fields can't be empty")
        return v

    @field_validator("is_agreed")
    def check_agreed(cls, v):
        if not v:
            raise ValueError(
                "You must agree 'Acquisition and Use of Personal Information' Policy"
            )
        return v

    @field_validator("industry_code")
    def industry_code_validator(cls, v):
        return industry_code_validator(v)

    @field_validator("job_type_code")
    def job_type_code_validator(cls, v):
        return job_type_code_validator(v)
