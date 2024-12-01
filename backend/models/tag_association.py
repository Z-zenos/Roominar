from sqlmodel import Enum, Field

from backend.core.constants import TagAssociationEntityCode
from backend.models.base_model import BaseModel


class TagAssociation(BaseModel, table=True):
    __tablename__: str = "tag_associations"

    entity_id: int
    tag_id: int = Field(foreign_key="tags.id")
    entity_code: TagAssociationEntityCode = Field(
        sa_type=Enum(TagAssociationEntityCode)
    )
