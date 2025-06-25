from contextlib import contextmanager
from typing import Generator

from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
from sqlmodel import Session, create_engine, text

from backend.core.config import settings
from backend.utils.logger import logger

# Database engine configuration with connection pooling
ENGINE_CONFIG = {
    "poolclass": QueuePool,
    "pool_size": 20,  # Number of persistent connections
    "max_overflow": 30,  # Additional connections beyond pool_size
    "pool_pre_ping": True,  # Validate connections before use
    "pool_recycle": 3600,  # Recycle connections every hour
    "echo": settings.ENVIRONMENT == "dev",  # SQL logging in development
}

# Create engines for read and write operations
master_engine = create_engine(str(settings.MASTER_DATABASE_URI), **ENGINE_CONFIG)
read_engine = create_engine(str(settings.READ_DATABASE_URI), **ENGINE_CONFIG)

# Create session factories
MasterSessionFactory = sessionmaker(
    autocommit=False, autoflush=False, bind=master_engine, class_=Session
)
ReadSessionFactory = sessionmaker(
    autocommit=False, autoflush=False, bind=read_engine, class_=Session
)


def get_master_db() -> Generator[Session, None, None]:
    """
    Creates a new database session for write operations

    Returns:
        Session: A new database session bound to master DB
    """
    db = MasterSessionFactory()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise e
    finally:
        db.close()


def get_read_db() -> Generator[Session, None, None]:
    """
    Creates a new database session for read operations

    Returns:
        Session: A new database session bound to read DB
    """
    db = ReadSessionFactory()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise e
    finally:
        db.close()


@contextmanager
def get_db_session(use_master: bool = False):
    """
    Context manager for database sessions

    Args:
        use_master: If True, uses master DB for write operations
                   If False, uses read DB for read operations

    Yields:
        Session: Database session
    """
    session_factory = MasterSessionFactory if use_master else ReadSessionFactory
    db = session_factory()
    try:
        yield db
        if use_master:
            db.commit()
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise e
    finally:
        db.close()


@contextmanager
def get_master_session():
    """Context manager for master database sessions (write operations)"""
    with get_db_session(use_master=True) as session:
        yield session


@contextmanager
def get_read_session():
    """Context manager for read database sessions (read operations)"""
    with get_db_session(use_master=False) as session:
        yield session


# Health check functions
def check_database_health() -> dict:
    """
    Check database connectivity and return health status

    Returns:
        dict: Health status for both master and read databases
    """
    health_status = {
        "master_db": {"status": "healthy", "error": None},
        "read_db": {"status": "healthy", "error": None},
    }

    # Check master database
    try:
        with get_master_session() as db:
            result = db.connection().execute(text("SELECT 1"))
            result.close()
    except Exception as e:
        health_status["master_db"] = {"status": "unhealthy", "error": str(e)}
        logger.error(f"Master database health check failed: {e}")

    # Check read database
    try:
        with get_read_session() as db:
            result = db.connection().execute(text("SELECT 1"))
            result.close()
    except Exception as e:
        health_status["read_db"] = {"status": "unhealthy", "error": str(e)}
        logger.error(f"Read database health check failed: {e}")

    return health_status


# Backwards compatibility (deprecated - will be removed)
SessionLocal = ReadSessionFactory
logger.warning(
    "SessionLocal is deprecated. Use get_db_session context manager instead."
)
