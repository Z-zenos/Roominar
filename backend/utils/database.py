from contextlib import contextmanager
from typing import Any, TypeVar

from sqlmodel import Session, SQLModel

from backend.db.database import get_master_session, get_read_session
from backend.models.base_model import BaseModel
from backend.utils.logger import logger

T = TypeVar("T", bound=SQLModel)


def save(db: Session, obj: T) -> T:
    """
    Save an object to the database

    Args:
        db: Database session
        obj: SQLModel object to save

    Returns:
        The saved object with updated fields
    """
    try:
        db.add(obj)
        db.flush()  # Flush to get the ID without committing
        db.refresh(obj)
        return obj
    except Exception as e:
        logger.error(f"Error saving object {type(obj).__name__}: {e}")
        db.rollback()
        raise


def save_and_commit(db: Session, obj: T) -> T:
    """
    Save an object to the database and commit the transaction

    Args:
        db: Database session
        obj: SQLModel object to save

    Returns:
        The saved object with updated fields
    """
    try:
        obj = save(db, obj)
        db.commit()
        return obj
    except Exception as e:
        logger.error(f"Error saving and committing object {type(obj).__name__}: {e}")
        db.rollback()
        raise


@contextmanager
def transaction_scope(use_master: bool = True):
    """
    Context manager for database transactions

    Args:
        use_master: Whether to use master database (for writes)
    """
    session_manager = get_master_session if use_master else get_read_session

    with session_manager() as session:
        try:
            yield session
            if use_master:
                session.commit()
        except Exception as e:
            logger.error(f"Transaction failed: {e}")
            if use_master:
                session.rollback()
            raise


class DatabaseManager:
    """
    Database manager for handling common database operations
    """

    @staticmethod
    def create_with_session(obj: T) -> T:
        """Create an object using a new session"""
        with transaction_scope(use_master=True) as db:
            return save(db, obj)

    @staticmethod
    def update_with_session(obj: T) -> T:
        """Update an object using a new session"""
        with transaction_scope(use_master=True) as db:
            db.merge(obj)
            db.commit()
            return obj

    @staticmethod
    def delete_with_session(obj: T) -> None:
        """Delete an object using a new session"""
        with transaction_scope(use_master=True) as db:
            db.delete(obj)
            db.commit()


# Legacy support - will be deprecated
def get_db_session():
    """
    Legacy function for getting database session
    This is deprecated and will be removed
    """
    logger.warning(
        "get_db_session is deprecated. Use transaction_scope context manager instead."
    )
    return get_master_session()


def fetch_one(db: Session, query: Any) -> dict[str, Any] | None:
    ret = db.exec(query).one_or_none()
    return ret if ret else None


def fetch_all(db: Session, query: Any) -> list[dict[str, Any]]:
    ret = db.exec(query).fetchall()
    return [r.__dict__ for r in ret]
