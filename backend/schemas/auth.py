from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, ValidationInfo, field_validator

from backend.core.constants import IndustryCode, JobTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.schemas.common import password_validator
from backend.schemas.user import UserBase


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str
    role_code: str
    remember_me: bool | None = None


class TokenResponse(BaseModel):
    token_type: str
    access_token: str
    expire_at: datetime
    refresh_token: str
    refresh_expire_at: datetime


class GetMeResponse(UserBase):
    pass


class SocialAuthRequest(BaseModel):
    email: EmailStr
    is_verified: bool
    family_name: str | None = None
    given_name: str | None = None
    name: str | None = None
    picture: str | None = None


class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    role_code: str


class ForgotPasswordResponse(BaseModel):
    email: EmailStr
    expire_at: datetime


class ResetPasswordRequest(BaseModel):
    new_password: str
    confirm_password: str

    @field_validator("new_password")
    def new_password_validator(cls, v):
        return password_validator(v)

    @field_validator("confirm_password")
    def confirm_password_validator(cls, v: Optional[str], values: ValidationInfo):
        if values.data.get("new_password") != v:
            raise ValueError(
                ErrorCode.ERR_PASSWORD_NOT_MATCHING,
                ErrorMessage.ERR_PASSWORD_NOT_MATCHING,
            )
        return v


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


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_new_password: str

    @field_validator("new_password")
    def new_password_validator(cls, v):
        return password_validator(v)

    @field_validator("confirm_new_password")
    def confirm_new_password_validator(cls, v: Optional[str], values: ValidationInfo):
        if values.data.get("new_password") != v:
            raise ValueError(
                ErrorCode.ERR_PASSWORD_NOT_MATCHING,
                ErrorMessage.ERR_PASSWORD_NOT_MATCHING,
            )
        return v
