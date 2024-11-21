from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, ValidationInfo, field_validator

from backend.core.constants import IndustryCode, JobTypeCode, OrganizationTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.schemas.common import password_validator
from backend.schemas.user import UserBase


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=255)
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


class ChangeEmailRequest(BaseModel):
    new_email: EmailStr
    password: str

    @field_validator("password")
    def password_validator(cls, v):
        return password_validator(v)


class RequestChangeEmailResponse(BaseModel):
    email: str
    expire_at: datetime


class RegisterOrganizationRequest(BaseModel):
    email: EmailStr
    password: str | None
    confirm_password: str | None
    first_name: str
    last_name: str | None = None

    name: str
    hp_url: str | None
    city_code: str | None
    # contact_email: EmailStr | None
    address: str | None
    representative_url: str | None
    phone: str | None
    type: OrganizationTypeCode

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

    # @field_validator("hp_url")
    # def hp_url_validator(cls, v):
    #     return hp_url_validator(v)

    @field_validator("type")
    def type_validator(cls, v, values: ValidationInfo):
        if v == OrganizationTypeCode.PERSONAL:
            return v
        else:
            if (
                # not values.data.get("city_code")
                # or not values.data.get("contact_email")
                not values.data.get("address")
                or not values.data.get("representative_url")
                or not values.data.get("phone")
            ):
                raise ValueError(
                    ErrorCode.ERR_MISSING_FIELDS,
                    ErrorMessage.ERR_MISSING_FIELDS,
                )
