from datetime import datetime
from typing import Optional

from sqlmodel import DateTime, Enum, Field, String, Text

from backend.core.constants import IndustryCode, JobTypeCode, LoginMethodCode, RoleCode
from backend.models.base_model import BaseModel


class User(BaseModel, table=True):
    __tablename__: str = "users"

    organization_id: Optional[int] = Field(foreign_key="organizations.id")

    role_code: RoleCode = Field(sa_type=Enum(RoleCode), default=RoleCode.AUDIENCE)

    email: str = Field(sa_type=String(255))
    password: Optional[str] = Field(sa_type=String(255))
    first_name: str = Field(sa_type=String(255))
    last_name: Optional[str] = Field(sa_type=String(255))

    workplace_name: Optional[str] = Field(sa_type=String(255))

    phone: Optional[str] = Field(sa_type=String(20))

    address: Optional[str] = Field(sa_type=Text)
    city_code: Optional[str] = Field(sa_type=String(50))
    industry_code: Optional[IndustryCode] = Field(sa_type=Enum(IndustryCode))
    job_type_code: Optional[JobTypeCode] = Field(sa_type=Enum(JobTypeCode))
    avatar_url: Optional[str] = Field(sa_type=String(2048))

    verify_email_token: Optional[str] = Field(sa_type=String(2048))
    verify_email_token_expire_at: Optional[datetime] = Field(
        sa_type=DateTime(timezone=True)
    )
    email_verified_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))

    reset_password_token: Optional[str] = Field(sa_type=String(2048))
    reset_password_token_expire_at: Optional[datetime] = Field(
        sa_type=DateTime(timezone=True)
    )
    password_changed_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))

    new_email: Optional[str] = Field(sa_type=String(255))
    old_email: Optional[str] = Field(sa_type=String(255))
    verify_change_email_token: Optional[str] = Field(sa_type=String(2048))
    verify_change_email_token_expire_at: Optional[datetime] = Field(
        sa_type=DateTime(timezone=True)
    )

    revert_email_token: Optional[str] = Field(sa_type=String(2048))
    revert_email_token_expire_at: Optional[datetime] = Field(
        sa_type=DateTime(timezone=True)
    )

    email_changed_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    deleted_at: Optional[datetime] = Field(sa_type=DateTime(timezone=True))
    login_method_code: Optional[LoginMethodCode] = Field(sa_type=Enum(LoginMethodCode))
