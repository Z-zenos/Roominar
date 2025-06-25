from typing import List, Optional, Type, TypeVar

from sqlmodel import Session, SQLModel, select

from backend.utils.database import transaction_scope

T = TypeVar("T", bound=SQLModel)


class SessionHelper:
    """
    Helper class to simplify database operations with proper session management
    """

    @staticmethod
    def get_entity_by_id(
        model: Type[T], entity_id: int, use_master: bool = False
    ) -> Optional[T]:
        """Get a single entity by ID"""
        with transaction_scope(use_master=use_master) as db:
            return db.get(model, entity_id)

    @staticmethod
    def get_entities_by_ids(
        model: Type[T], entity_ids: List[int], use_master: bool = False
    ) -> List[T]:
        """Get multiple entities by IDs"""
        with transaction_scope(use_master=use_master) as db:
            return db.exec(select(model).where(model.id.in_(entity_ids))).all()

    @staticmethod
    def execute_in_session(func, use_master: bool = True, *args, **kwargs):
        """
        Execute a function with a database session

        Args:
            func: Function that takes db as first parameter
            use_master: Whether to use master database
            *args: Additional arguments for the function
            **kwargs: Additional keyword arguments for the function
        """
        with transaction_scope(use_master=use_master) as db:
            return func(db, *args, **kwargs)

    @staticmethod
    def safe_get_user_organization(user_id: int, event_id: int) -> Optional[int]:
        """
        Safely get organization ID for a user from an event
        Returns None if not found
        """
        try:
            with transaction_scope(use_master=False) as db:
                from backend.models.event import Event
                from backend.models.user import User

                result = db.exec(
                    select(User.organization_id)
                    .join(Event, Event.organization_id == User.organization_id)
                    .where(Event.id == event_id)
                ).first()

                return result
        except Exception:
            return None

    @staticmethod
    def safe_get_entities(model: Type[T], **filters) -> List[T]:
        """
        Safely get entities with filters
        Returns empty list if error occurs
        """
        try:
            with transaction_scope(use_master=False) as db:
                query = select(model)
                for field, value in filters.items():
                    if hasattr(model, field):
                        query = query.where(getattr(model, field) == value)
                return db.exec(query).all()
        except Exception:
            return []


# Convenience functions for common operations
def with_session(use_master: bool = True):
    """
    Decorator to inject database session into function
    """

    def decorator(func):
        def wrapper(*args, **kwargs):
            with transaction_scope(use_master=use_master) as db:
                return func(db, *args, **kwargs)

        return wrapper

    return decorator


def get_multiple_by_ids(session: Session, model: Type[T], ids: List[int]) -> List[T]:
    """Get multiple entities by IDs using existing session"""
    if not ids:
        return []
    return session.exec(select(model).where(model.id.in_(ids))).all()


def safe_execute_query(session: Session, query, default=None):
    """Safely execute a query with error handling"""
    try:
        return session.exec(query).all()
    except Exception as e:
        from backend.utils.logger import logger

        logger.error(f"Query execution failed: {e}")
        return default or []
