from sqlmodel import Field, String

from backend.models.base_model import BaseModel


class TagGroup(BaseModel, table=True):
    __tablename__: str = "tag_groups"

    name: str = Field(sa_type=String(255))
