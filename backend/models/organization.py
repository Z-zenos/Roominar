from datetime import datetime
from typing import Optional

from sqlmodel import ARRAY, DateTime, Enum, Field, Integer, String, Text

from backend.core.constants import OrganizationTypeCode, ORGStatusCode
from backend.models.base_model import BaseModel


class Organization(BaseModel, table=True):
    __tablename__: str = "organizations"

    name: str = Field(sa_type=String(1024))
    hp_url: Optional[str] = Field(sa_type=String(2048))
    city_code: Optional[str] = Field(sa_type=String(50))
    contact_email: str = Field(sa_type=String(255))
    status: ORGStatusCode = Field(sa_type=Enum(ORGStatusCode))
    address: Optional[str] = Field(sa_type=Text)
    plan_code: Optional[str] = Field(sa_type=String(20))
    contact_url: Optional[str] = Field(sa_type=String(2048))
    avatar_url: Optional[str] = Field(sa_type=String(2048))
    description: Optional[str] = Field(sa_type=Text)
    phone: Optional[str] = Field(sa_type=String(20))
    confirmed_at: Optional[datetime] = Field(
        sa_type=DateTime(timezone=True),
        default=None,
    )
    facebook_url: Optional[str] = Field(sa_type=String(2048))
    remarks: Optional[str] = Field(sa_type=String(1024))
    type: OrganizationTypeCode = Field(sa_type=Enum(OrganizationTypeCode))
    representative_url: Optional[str] = Field(sa_type=String(2048))
    tags: Optional[list[int]] = Field(sa_type=ARRAY(Integer))
