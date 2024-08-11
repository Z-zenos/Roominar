from typing import Generator
from sqlmodel import Session, create_engine
from backend.core.config import settings

master_engine = create_engine(settings.MASTER_DATABASE_URI)
read_engine = create_engine(settings.READ_DATABASE_URI)

MasterDBSession = Session(autocommit=False, autoflush=False, bind=master_engine)
ReadDBSession = Session(autocommit=False, autoflush=False, bind=read_engine)


def get_master_db() -> Generator[Session, None, None]:
    """
    データベースセッションを取得するジェネレータ関数

    Returns:
        DbSession: データベースセッションオブジェクト
    """
    db = MasterDBSession
    try:
        yield db
    finally:
        db.close()


def get_read_db():
    db = ReadDBSession
    try:
        yield db
    finally:
        db.close()
