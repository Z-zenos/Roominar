from datetime import datetime
from typing import Any

from sqlalchemy.ext.declarative import declarative_base
from sqlmodel import BIGINT, Field, SQLModel, func, DateTime

Base = declarative_base()


class BaseModel(SQLModel):
    __abstract__ = True
    id: int = Field(sa_type=BIGINT, primary_key=True)

    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={
            "server_default": func.now(),
        },
    )
    updated_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={
            "server_default": func.now(),
            "onupdate": func.now(),
        },
    )

    def update_by_dict(self, data: dict[str, Any]):
        for key in data:
            if hasattr(self, key):
                setattr(self, key, data[key])
