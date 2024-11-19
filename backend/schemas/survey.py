from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, ValidationInfo, field_validator

from backend.core.constants import QuestionTypeCode, SurveyStatusCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.schemas.question import QuestionAnswerItem


class SurveyDetail(BaseModel):
    id: int
    name: str
    description: str | None
    status_code: SurveyStatusCode
    question_anwers: list[QuestionAnswerItem] = Field([])
    start_at: datetime | None
    end_at: datetime | None
    max_response_number: int | None


class CreateAnswerItem(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    answer: str = Field(max_length=1024)
    order_number: int
    is_correct: bool


class CreateQuestionAnswerRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    question: str = Field(max_length=1024)
    type_code: QuestionTypeCode
    answers: list[CreateAnswerItem] = Field([], min_length=1, max_length=10)
    order_number: int


class CreateSurveyRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(max_length=255)
    description: str | None
    start_at: datetime | None
    end_at: datetime | None
    max_response_number: int | None
    question_answers: list[CreateQuestionAnswerRequest] = Field(
        [], min_length=1, max_length=10
    )

    @field_validator("end_at")
    def validate_date(cls, v: str | None, values: ValidationInfo):
        start_at = values.data.get("start_at")
        if v and start_at and start_at > v:
            raise BadRequestException(
                ErrorCode.ERR_SURVEY_INVALID_START_END_DATE,
                ErrorMessage.ERR_SURVEY_INVALID_START_END_DATE,
            )

        return v


class ListingSurveyOptionsItem(BaseModel):
    id: int
    name: str
    question_number: int
