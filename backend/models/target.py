from typing import Optional

from sqlmodel import Field, ARRAY, String

from backend.core.constants import IndustryCode, JobTypeCode
from backend.models.base_model import BaseModel


class Target(BaseModel, table=True):
    __tablename__: str = "targets"

    organization_id: Optional[int] = Field(foreign_key="organizations.id")

    name: str = Field(sa_type=String(1024))

    industry_codes: Optional[list[IndustryCode]] = Field(sa_type=ARRAY(String(50)))
    job_type_codes: Optional[list[JobTypeCode]] = Field(sa_type=ARRAY(String(50)))
