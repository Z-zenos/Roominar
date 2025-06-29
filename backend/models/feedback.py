from pydantic import Field

from backend.models.base_model import BaseModel


class Feedback(BaseModel, table=True):
    __tablename__: str = "feedbacks"

    event_id: int = Field(foreign_key="events.id", index=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    comment: str
