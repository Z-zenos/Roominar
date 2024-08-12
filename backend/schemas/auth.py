from datetime import datetime
from pydantic import BaseModel, EmailStr
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


# class ChangePasswordRequest(BaseModel):
#     new_password: str


# class ForgotPasswordRequest(BaseModel):
#     email: Annotated[EmailStr, Field(description="登録しているメールアドレス")]
#     role_code: str


# class ForgotPasswordResponse(BaseModel):
#     email: EmailStr
#     expire_at: datetime


# class ResetPasswordRequest(BaseModel):
#     new_password: Annotated[
#         str, StringConstraints(min_length=8), Field(description="新パスワード")
#     ]

#     confirm_password: Annotated[
#         str, StringConstraints(min_length=8), Field(description="新パスワード（確認）")
#     ]

#     @validator("confirm_password")
#     def validate_confirm_password(cls, v, values) -> str:
#         if "new_password" in values and v != values["new_password"]:
#             raise ValueError("Passwords do not match")
#         return v

#     model_config = {
#         "json_schema_extra": {
#             "examples": [
#                 {
#                     "new_password": "12345678",
#                     "confirm_password": "12345678",
#                 }
#             ]
#         }
#     }


# class ResetPasswordResponse(BaseModel):
#     status: str
#     message: str


# class ResetPasswordTokenResponse(BaseModel):
#     token: str
#     expire_at: datetime
