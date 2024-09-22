from typing import Any

from sqlmodel import Session

from backend.models.base_model import BaseModel


def save(db: Session, object: BaseModel):
    db.add(object)
    db.commit()
    db.refresh(object)
    return object


def fetch_one(db: Session, query: Any) -> dict[str, Any] | None:
    ret = db.exec(query).one_or_none()
    return ret if ret else None


def fetch_all(db: Session, query: Any) -> list[dict[str, Any]]:
    ret = db.exec(query).fetchall()
    return [r.__dict__ for r in ret]
