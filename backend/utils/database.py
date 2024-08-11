import typing as t
from backend.models.base_model import BaseModel
from sqlmodel import Session


def save(db: Session, object: BaseModel):
    db.add(object)
    db.commit()
    db.refresh(object)


def fetch_one(db: Session, query: t.Any) -> dict[str, t.Any] | None:
    ret = db.exec(query).one_or_none()
    return ret if ret else None


def fetch_all(db: Session, query: t.Any) -> list[dict[str, t.Any]]:
    ret = db.exec(query).fetchall()
    return [r.__dict__ for r in ret]
