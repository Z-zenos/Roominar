"""Add speaker table

Revision ID: 4e4116088798
Revises: abb5e7144797
Create Date: 2025-02-13 15:58:06.392256

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import ENUM

# revision identifiers, used by Alembic.
revision: str = "4e4116088798"
down_revision: Union[str, None] = "abb5e7144797"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# Fetch existing IndustryCode enum
industry_code_enum = ENUM(
    "REAL_ESTATE",
    "CONSTRUCTION",
    "FOOD_DRINK",
    "COSMETICS_MANUFACTURING",
    "ELECTRONICS_MANUFACTURING",
    "PRECISION_MANUFACTURING",
    "AUTOMOTIVE_MANUFACTURING",
    "FASHION_MANUFACTURING",
    "B2C_MANUFACTURING",
    "B2B_MANUFACTURING",
    "LOGISTICS",
    "IT_COMMUNICATIONS",
    "CONTRACT_DEVELOPMENT",
    "RETAIL",
    "WHOLESALE",
    "FINANCE",
    "HOSPITALITY",
    "CONSULTING",
    "HEALTHCARE",
    "ADVERTISING",
    "ENTERTAINMENT",
    "EDUCATION",
    "MEDIA",
    "MINING",
    "TRANSPORTATION",
    "WAREHOUSING",
    "CHEMICAL",
    "OTHER",
    name="industrycode",
    create_type=False,
)

job_type_code_enum = ENUM(
    "DEV",
    "QA",
    "PM",
    "TESTER",
    "SYSADMIN",
    "DBA",
    "SA",
    "ACC",
    "FIN",
    "CFA",
    "TAX",
    "AUD",
    "SEO",
    "SMM",
    "PR",
    "AD",
    "CMM",
    "TEACHER",
    "LECTURER",
    "TUTOR",
    "PRINCIPAL",
    "COUNSELOR",
    "DOCTOR",
    "NURSE",
    "PHARM",
    "SURGEON",
    "THER",
    "ARCH",
    "ENG",
    "CIVIL",
    "CON",
    "QS",
    "DESIGNER",
    "ARTIST",
    "WRITER",
    "MUSICIAN",
    "ACTOR",
    "CS",
    "SALES",
    "CRM",
    "CASHIER",
    "MERCH",
    "DRIVER",
    "LOG",
    "WAREHOUSE",
    "SHIP",
    "FARMER",
    "AGR",
    "VET",
    "HORT",
    name="jobtypecode",
    create_type=False,
)


def upgrade() -> None:
    op.create_table(
        "speakers",
        sa.Column("id", sa.BIGINT(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("created_by", sa.Integer(), nullable=True),
        sa.Column("updated_by", sa.Integer(), nullable=True),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("phone", sa.String(length=255), nullable=True),
        sa.Column("skills", sa.ARRAY(sa.String(length=50)), nullable=True),
        sa.Column("description", sa.String(length=2048), nullable=True),
        sa.Column("first_name", sa.String(length=255), nullable=False),
        sa.Column("last_name", sa.String(length=255), nullable=True),
        sa.Column("industry_code", industry_code_enum, nullable=True),
        sa.Column("job_type_code", job_type_code_enum, nullable=True),
        sa.Column("avatar_url", sa.String(length=2048), nullable=True),
        sa.Column("facebook_url", sa.String(length=2048), nullable=True),
        sa.Column("twitter_url", sa.String(length=2048), nullable=True),
        sa.Column("linkedin_url", sa.String(length=2048), nullable=True),
        sa.Column("youtube_url", sa.String(length=2048), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("speakers")
