from typing import Generator

from sqlalchemy.orm import declarative_base
from sqlmodel import Session, create_engine

from backend.core.config import settings

master_engine = create_engine(str(settings.MASTER_DATABASE_URI))
read_engine = create_engine(str(settings.READ_DATABASE_URI))

# Create session factories using SQLModel's Session
# MasterSessionFactory = sessionmaker(
#     autocommit=False, autoflush=False, bind=master_engine, class_=Session
# )
ReadSessionFactory = Session

# def get_master_db() -> Generator[Session, None, None]:
#     """
#     Creates a new database session for write operations

#     Returns:
#         Session: A new database session
#     """
#     db = MasterSessionFactory()
#     try:
#         yield db
#     finally:
#         db.close()


def get_read_db() -> Generator[Session, None, None]:
    """
    Creates a new database session for read operations

    Returns:
        Session: A new database session
    """
    db = Session(read_engine)
    try:
        yield db
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


# Keep this for backwards compatibility if needed
SessionLocal = Session

Base = declarative_base()
