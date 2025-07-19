import pytest
from fastapi.testclient import TestClient
from sqlalchemy.exc import OperationalError as SQLAlchemyOperationalError
from sqlalchemy.orm import declarative_base
from sqlmodel import Session, StaticPool, create_engine

from backend.core.config import settings
from backend.core.constants import RoleCode
from backend.db.database import get_read_db
from backend.main import app
from backend.models.user import User
from backend.services.auth import token_service

Base = declarative_base()


def pytest_addoption(parser):
    parser.addoption(
        "--database-url",
        action="store",
        default=str(settings.READ_DATABASE_URI),
        help="Database URL to use for tests.",
    )


@pytest.hookimpl(tryfirst=True)
def pytest_sessionstart(session):
    # Use the database URL from settings directly, or from command line if provided
    db_url = session.config.getoption("--database-url")
    try:
        # Attempt to create an engine and connect to the database.
        engine = create_engine(
            db_url,
            poolclass=StaticPool,
        )
        connection = engine.connect()
        connection.close()  # Close the connection right after a successful connect.
        print("Database connection successful........")
    except SQLAlchemyOperationalError as e:
        print(f"Failed to connect to the database at {db_url}: {e}")
        pytest.exit(
            "Stopping tests because database connection could not be established."
        )


@pytest.fixture(scope="session")
def db_url(request):
    """Fixture to retrieve the database URL."""
    return request.config.getoption("--database-url")


@pytest.fixture(scope="function")
def db_session(db_url):
    """Create a new database session with a rollback at the end of the test."""
    # Create a SQLModel engine
    engine = create_engine(
        db_url,
        poolclass=StaticPool,
    )

    # Create tables in the database
    Base.metadata.create_all(bind=engine)
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client that uses the override_get_db fixture to return a session."""

    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()

    app.dependency_overrides[get_read_db] = override_get_db
    with TestClient(app) as client:
        yield client


@pytest.fixture(scope="function")
def authenticated_organizer_client(client: TestClient, db_session: Session):
    # user = User(
    #     email="organizer@example.com",
    #     role_code=RoleCode.ORGANIZER,
    #     email_verified_at=datetime.now(),
    #     organization_id=1,
    # )
    # db_session.add(user)
    # db_session.commit()
    token = token_service.gen_auth_token(
        User(
            email="org@gmail.com",
            role_code=RoleCode.ORGANIZER,
        ),
        remember_me=True,
    )
    client.headers.update({"Authorization": f"Bearer {token['access_token']}"})
    return client


# ==== REFERENCE FROM STACKOVERFLOW ====
# https://stackoverflow.com/questions/67255653/how-to-set-up-and-tear-down-a-database-between-tests-in-fastapi
# import pytest
# import sqlalchemy as sa
# from fastapi.testclient import TestClient
# from sqlalchemy.orm import sessionmaker
# from sqlmodel import Session

# from backend.core.config import settings
# from backend.db.database import Base, get_read_db
# from backend.main import app

# engine = sa.create_engine(settings.READ_DATABASE_URI)
# TestingSessionLocal = sessionmaker(
#     autocommit=False, autoflush=False, bind=engine, class_=Session
# )

# # Set up the database once
# Base.metadata.drop_all(bind=engine)
# Base.metadata.create_all(bind=engine)


# # These two event listeners are only needed for sqlite for proper
# # SAVEPOINT / nested transaction support. Other databases like postgres
# # don't need them.
# # From: https://docs.sqlalchemy.org/en/14/dialects/sqlite.html#serializable-isolation-savepoints-transactional-ddl
# @sa.event.listens_for(engine, "connect")
# def do_connect(dbapi_connection, connection_record):
#     # disable pysqlite's emitting of the BEGIN statement entirely.
#     # also stops it from emitting COMMIT before any DDL.
#     dbapi_connection.isolation_level = None


# @sa.event.listens_for(engine, "begin")
# def do_begin(conn):
#     # emit our own BEGIN
#     conn.exec_driver_sql("BEGIN")


# # This fixture is the main difference to before. It creates a nested
# # transaction, recreates it when the application code calls session.commit
# # and rolls it back at the end.
# # Based on: https://docs.sqlalchemy.org/en/14/orm/session_transaction.html#joining-a-session-into-an-external-transaction-such-as-for-test-suites
# @pytest.fixture()
# def session():
#     connection = engine.connect()
#     transaction = connection.begin()
#     session = TestingSessionLocal(bind=connection)

#     # Begin a nested transaction (using SAVEPOINT).
#     nested = connection.begin_nested()

#     # If the application code calls session.commit, it will end the nested
#     # transaction. Need to start a new one when that happens.
#     @sa.event.listens_for(session, "after_transaction_end")
#     def end_savepoint(session, transaction):
#         nonlocal nested
#         if not nested.is_active:
#             nested = connection.begin_nested()

#     yield session

#     # Rollback the overall transaction, restoring the state before the test ran.
#     session.close()
#     transaction.rollback()
#     connection.close()


# # A fixture for the fastapi test client which depends on the
# # previous session fixture. Instead of creating a new session in the
# # dependency override as before, it uses the one provided by the
# # session fixture.
# @pytest.fixture()
# def client(session):
#     def override_get_db():
#         yield session

#     app.dependency_overrides[get_read_db] = override_get_db
#     yield TestClient(app=app)
#     del app.dependency_overrides[get_read_db]
