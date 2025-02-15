from typing import Optional

from sqlmodel import ARRAY, Enum, Field, String

from backend.core.constants import IndustryCode, JobTypeCode
from backend.models.base_model import BaseModel


class Speaker(BaseModel, table=True):
    __tablename__: str = "speakers"

    # For speaker don't have account
    user_id: Optional[int] = Field(foreign_key="users.id")
    email: Optional[str] = Field(sa_type=String(255))
    phone: Optional[str] = Field(sa_type=String(255))
    skills: Optional[list[str]] = Field(sa_type=ARRAY(String(50)))
    description: Optional[str] = Field(sa_type=String(2048))
    first_name: str = Field(sa_type=String(255))
    last_name: Optional[str] = Field(sa_type=String(255))
    industry_code: Optional[IndustryCode] = Field(sa_type=Enum(IndustryCode))
    job_type_code: Optional[JobTypeCode] = Field(sa_type=Enum(JobTypeCode))
    avatar_url: Optional[str] = Field(sa_type=String(2048))
    facebook_url: Optional[str] = Field(sa_type=String(2048))
    twitter_url: Optional[str] = Field(sa_type=String(2048))
    linkedin_url: Optional[str] = Field(sa_type=String(2048))
    youtube_url: Optional[str] = Field(sa_type=String(2048))
