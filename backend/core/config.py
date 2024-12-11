import logging
from pathlib import Path
from typing import Any, Literal, Optional

from pydantic import DirectoryPath, PostgresDsn, ValidationInfo, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from backend.utils.logging import CustomFormatter

# create logger with 'spam_application'
logger = logging.getLogger("Roominar")
logger.setLevel(logging.DEBUG)

# create console handler with a higher log level
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)

ch.setFormatter(CustomFormatter())

logger.addHandler(ch)


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
    # BUCKET_NAME: Optional[str]
    # MEDIA_PATH: Optional[str]
    # MEDIA_PATH_TMP_PREFIX: str = "tmp/"
    # PUBLIC_CDN_URL: Optional[str]
    APP_PORT: Optional[str]
    APP_URL: Optional[str]

    AUD_FRONTEND_URL: Optional[str]

    STRIPE_SECRET_KEY: Optional[str]

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
