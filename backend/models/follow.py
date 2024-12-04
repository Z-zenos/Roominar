from sqlmodel import Enum, Field

from backend.core.constants import FollowEntityCode
from backend.models.base_model import BaseModel


class Follow(BaseModel, table=True):
    __tablename__: str = "follows"

    following_id: int
    follower_id: int
    entity_code: FollowEntityCode = Field(sa_type=Enum(FollowEntityCode))
