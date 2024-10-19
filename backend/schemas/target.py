from pydantic import BaseModel, ConfigDict, Field

from backend.core.constants import IndustryCode, JobTypeCode


class CreateTargetRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str
    industry_codes: list[IndustryCode] = Field([])
    job_type_codes: list[JobTypeCode] = Field([])


class ListingTargetOptionsItem(BaseModel):
    id: int
    name: str
