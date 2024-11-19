from pydantic import BaseModel, EmailStr, Field, field_validator

from backend.schemas.common import industry_code_validator, job_type_code_validator
from backend.schemas.survey_response_result import SurveyResponseResultItem


class CreateApplicationRequest(BaseModel):
    email: EmailStr
    first_name: str = Field(max_length=255)
    last_name: str = Field(max_length=255)
    workplace_name: str = Field(max_length=255)
    phone: str = Field(max_length=20)
    industry_code: str = Field(max_length=50)
    job_type_code: str = Field(max_length=20)
    survey_response_results: list[SurveyResponseResultItem] = Field([])
    ticket_id: int
    is_agreed: bool

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
