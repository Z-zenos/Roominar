from pathlib import Path
from typing import Any, Literal, Optional

from pydantic import DirectoryPath, PostgresDsn, ValidationInfo, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from backend.utils.logger import logger


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="backend/.env", case_sensitive=True, env_file_encoding="utf-8"
    )

    PROJECT: str = "Roominar"

    # Master DB config
    MASTER_DB_CONNECTION: Optional[str]
    MASTER_DB_HOST: Optional[str]
    MASTER_DB_PORT: Optional[str]
    MASTER_DB_DATABASE: Optional[str]
    MASTER_DB_USERNAME: Optional[str]
    MASTER_DB_PASSWORD: Optional[str]
    MASTER_DATABASE_URI: Optional[PostgresDsn | str] = None

    # Read DB config
    READ_DB_CONNECTION: Optional[str]
    READ_DB_HOST: Optional[str]
    READ_DB_PORT: Optional[str]
    READ_DB_DATABASE: Optional[str]
    READ_DB_USERNAME: Optional[str]
    READ_DB_PASSWORD: Optional[str]
    READ_DATABASE_URI: Optional[PostgresDsn | str] = None

    # API Performance & Caching Configuration
    REDIS_CACHE_TTL_DEFAULT: int = 300  # 5 minutes
    REDIS_CACHE_TTL_EVENTS: int = 600  # 10 minutes for events
    REDIS_CACHE_TTL_TRENDING: int = 900  # 15 minutes for trending
    REDIS_CACHE_TTL_STATIC: int = 3600  # 1 hour for static data
    REDIS_CACHE_TTL_USER_DATA: int = 1800  # 30 minutes for user data

    # Rate Limiting Configuration
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 100
    RATE_LIMIT_BURST_SIZE: int = 200
    RATE_LIMIT_SLIDING_WINDOW_SIZE: int = 60  # seconds

    # API Performance Settings
    API_RESPONSE_TIMEOUT: int = 30  # seconds
    MAX_CONCURRENT_REQUESTS: int = 1000
    REQUEST_BATCH_SIZE: int = 50
    QUERY_BATCH_SIZE: int = 100

    # Connection Pool Optimization
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 30
    DB_POOL_RECYCLE: int = 3600
    DB_POOL_TIMEOUT: int = 10

    # Async Processing Configuration
    ASYNC_WORKER_COUNT: int = 4
    ASYNC_QUEUE_SIZE: int = 1000
    BACKGROUND_TASK_TIMEOUT: int = 300  # 5 minutes

    # Auth config
    ALGORITHM: Optional[str]
    SECRET_KEY: Optional[str]
    ACCESS_TOKEN_EXPIRE_MINUTES: Optional[int]
    REFRESH_TOKEN_EXPIRE_MINUTES: Optional[int]
    REFRESH_TOKEN_REMEMBERED_EXPIRE_MINUTES: Optional[int]
    EMAIL_HOST: Optional[str]
    EMAIL_USERNAME: Optional[str]
    EMAIL_PASSWORD: Optional[str]
    EMAIL_PORT: Optional[str]
    AUD_SENDER_EMAIL: Optional[str]
    ORG_SENDER_EMAIL: Optional[str]

    AUD_SENDER_NAME: Optional[str]
    ORG_SENDER_NAME: Optional[str]

    EMAIL_VERIFICATION_TOKEN_LENGTH: Optional[int]
    EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES: Optional[int]
    RESET_PASSWORD_TOKEN_LENGTH: Optional[int]
    RESET_PASSWORD_TOKEN_EXPIRE_MINUTES: Optional[int]

    VERIFY_CHANGE_EMAIL_TOKEN_LENGTH: Optional[int]
    VERIFY_CHANGE_EMAIL_TOKEN_EXPIRE_MINUTES: Optional[int]

    REVERT_EMAIL_TOKEN_LENGTH: Optional[int]
    REVERT_EMAIL_TOKEN_EXPIRE_MINUTES: Optional[int]

    EMAIL_ADMIN: Optional[str]

    TEMPLATE_FOLDER: DirectoryPath = Path(__file__).parent / "../mails/templates"
    SERVER_PORT: Optional[str]
    SERVER_URL: Optional[str]

    WEB_URL: Optional[str]

    STRIPE_SECRET_KEY: Optional[str]
    STRIPE_DEVICE_NAME: Optional[str]
    STRIPE_WEBHOOK_SECRET: Optional[str]

    OPEN_AI_KEY: Optional[str]
    GEMINI_API_KEY: Optional[str]

    REDIS_PORT: Optional[str]
    REDIS_HOST: Optional[str]
    REDIS_URL: Optional[str]

    CELERY_BROKER_URL: Optional[str]
    CELERY_RESULT_BACKEND: Optional[str]

    CLOUDINARY_CLOUD_NAME: Optional[str]
    CLOUDINARY_API_KEY: Optional[str]
    CLOUDINARY_API_SECRET: Optional[str]

    QR_CHECK_IN_SECRET_KEY: Optional[str]

    ENVIRONMENT: Literal["dev", "staging", "production"] = "dev"

    @field_validator("MASTER_DATABASE_URI", mode="before")
    def assemble_master_db_connection(
        cls, v: Optional[str], values: ValidationInfo
    ) -> Any:
        logger.info("Loading MASTER_DATABASE_URI from .docker.env file ...")
        if isinstance(v, str) and v:
            return v

        logger.info("Creating MASTER_DATABASE_URI from .env file ...")

        return PostgresDsn.build(
            scheme="postgresql",
            username=values.data.get("MASTER_DB_USERNAME"),
            password=values.data.get("MASTER_DB_PASSWORD"),
            host=values.data.get("MASTER_DB_HOST"),
            port=int(values.data.get("MASTER_DB_PORT")),
            path=f"{values.data.get('MASTER_DB_DATABASE') or ''}",
        ).unicode_string()

    @field_validator("READ_DATABASE_URI", mode="before")
    def assemble_read_db_connection(
        cls, v: Optional[str], values: ValidationInfo
    ) -> Any:
        if isinstance(v, str) and v:
            logger.info("Loading READ_DATABASE_URI from .docker.env file ...")
            return v

        logger.info("Creating READ_DATABASE_URI from .env file ...")

        return PostgresDsn.build(
            scheme="postgresql",
            username=values.data.get("READ_DB_USERNAME"),
            password=values.data.get("READ_DB_PASSWORD"),
            host=values.data.get("READ_DB_HOST"),
            port=int(values.data.get("READ_DB_PORT")),
            path=f"{values.data.get('READ_DB_DATABASE') or ''}",
        ).unicode_string()


settings = Settings()
