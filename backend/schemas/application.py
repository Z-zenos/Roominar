from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from backend.core.constants import IndustryCode, JobTypeCode
from backend.schemas.common import (
    industry_code_validator,
    job_type_code_validator,
    phone_validator,
)
from backend.schemas.survey_response_result import SurveyResponseResultItem


class ApplicationTicket(BaseModel):
    id: int
    quantity: int


class CreateApplicationCheckoutSessionRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    event_id: int
    email: EmailStr
    first_name: str = Field(max_length=255)
    last_name: str | None = Field(max_length=255)
    workplace_name: str | None = Field(max_length=255)
    phone: str = Field(max_length=20)
    industry_code: IndustryCode | None = None
    job_type_code: JobTypeCode | None = None
    survey_response_results: list[SurveyResponseResultItem] = Field([])
    tickets: list[ApplicationTicket] = Field([])
    is_agreed: bool

    @field_validator("first_name", "phone", "email")
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

    @field_validator("phone")
    def phone_validator(cls, v):
        return phone_validator(v)

    @field_validator("industry_code")
    def industry_code_validator(cls, v):
        return industry_code_validator(v)

    @field_validator("job_type_code")
    def job_type_code_validator(cls, v):
        return job_type_code_validator(v)


class CreateApplicationCheckoutSessionResponse(BaseModel):
    client_secret: str | None = None
