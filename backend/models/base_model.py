from datetime import datetime
from typing import Any, Optional

from sqlalchemy.ext.declarative import declarative_base
from sqlmodel import BIGINT, DateTime, Field, SQLModel, func

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

    created_by: Optional[int]
    updated_by: Optional[int]

    def update_by_dict(self, data: dict[str, Any]):
        for key in data:
            if hasattr(self, key):
                setattr(self, key, data[key])
