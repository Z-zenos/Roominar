from sqlmodel import Enum, Field, UniqueConstraint

from backend.core.constants import VoteTypeCode
from backend.models.base_model import BaseModel


class CommentVote(BaseModel, table=True):
    __tablename__ = "comment_votes"

    comment_id: int = Field(foreign_key="comments.id", index=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    vote_type: VoteTypeCode = Field(sa_type=Enum(VoteTypeCode))

    __table_args__ = (
        UniqueConstraint(
            "comment_id",
            "user_id",
            name="uix_comment_user_vote",
        ),
    )
