"""Base add updated_by, created_by

Revision ID: 15610f71f321
Revises: 158acdaaecbc
Create Date: 2024-09-10 14:41:47.365577

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "15610f71f321"
down_revision: Union[str, None] = "158acdaaecbc"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("answers", sa.Column("created_by", sa.Integer(), nullable=True))
    op.add_column("answers", sa.Column("updated_by", sa.Integer(), nullable=True))
    op.add_column("applications", sa.Column("created_by", sa.Integer(), nullable=True))
    op.add_column("applications", sa.Column("updated_by", sa.Integer(), nullable=True))
    op.add_column("bookmarks", sa.Column("created_by", sa.Integer(), nullable=True))
    op.add_column("bookmarks", sa.Column("updated_by", sa.Integer(), nullable=True))
    op.add_column("event_tags", sa.Column("created_by", sa.Integer(), nullable=True))
    op.add_column("event_tags", sa.Column("updated_by", sa.Integer(), nullable=True))
    op.add_column("events", sa.Column("created_by", sa.Integer(), nullable=True))
    op.add_column("events", sa.Column("updated_by", sa.Integer(), nullable=True))
    op.add_column("organizations", sa.Column("created_by", sa.Integer(), nullable=True))
    op.add_column("organizations", sa.Column("updated_by", sa.Integer(), nullable=True))
    op.add_column(
        "question_answer_results", sa.Column("created_by", sa.Integer(), nullable=True)
    )
    op.add_column(
        "question_answer_results", sa.Column("updated_by", sa.Integer(), nullable=True)
    )
    op.add_column(
        "questionnaires", sa.Column("created_by", sa.Integer(), nullable=True)
    )
    op.add_column(
        "questionnaires", sa.Column("updated_by", sa.Integer(), nullable=True)
    )
    op.add_column("questions", sa.Column("created_by", sa.Integer(), nullable=True))
    op.add_column("questions", sa.Column("updated_by", sa.Integer(), nullable=True))
    op.add_column("tag_groups", sa.Column("created_by", sa.Integer(), nullable=True))
    op.add_column("tag_groups", sa.Column("updated_by", sa.Integer(), nullable=True))
    op.add_column("tags", sa.Column("created_by", sa.Integer(), nullable=True))
    op.add_column("tags", sa.Column("updated_by", sa.Integer(), nullable=True))
    op.add_column("targets", sa.Column("created_by", sa.Integer(), nullable=True))
    op.add_column("targets", sa.Column("updated_by", sa.Integer(), nullable=True))
    op.add_column("tickets", sa.Column("created_by", sa.Integer(), nullable=True))
    op.add_column("tickets", sa.Column("updated_by", sa.Integer(), nullable=True))
    op.add_column("user_tags", sa.Column("created_by", sa.Integer(), nullable=True))
    op.add_column("user_tags", sa.Column("updated_by", sa.Integer(), nullable=True))
    op.add_column("users", sa.Column("created_by", sa.Integer(), nullable=True))
    op.add_column("users", sa.Column("updated_by", sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("users", "updated_by")
    op.drop_column("users", "created_by")
    op.drop_column("user_tags", "updated_by")
    op.drop_column("user_tags", "created_by")
    op.drop_column("tickets", "updated_by")
    op.drop_column("tickets", "created_by")
    op.drop_column("targets", "updated_by")
    op.drop_column("targets", "created_by")
    op.drop_column("tags", "updated_by")
    op.drop_column("tags", "created_by")
    op.drop_column("tag_groups", "updated_by")
    op.drop_column("tag_groups", "created_by")
    op.drop_column("questions", "updated_by")
    op.drop_column("questions", "created_by")
    op.drop_column("questionnaires", "updated_by")
    op.drop_column("questionnaires", "created_by")
    op.drop_column("question_answer_results", "updated_by")
    op.drop_column("question_answer_results", "created_by")
    op.drop_column("organizations", "updated_by")
    op.drop_column("organizations", "created_by")
    op.drop_column("events", "updated_by")
    op.drop_column("events", "created_by")
    op.drop_column("event_tags", "updated_by")
    op.drop_column("event_tags", "created_by")
    op.drop_column("bookmarks", "updated_by")
    op.drop_column("bookmarks", "created_by")
    op.drop_column("applications", "updated_by")
    op.drop_column("applications", "created_by")
    op.drop_column("answers", "updated_by")
    op.drop_column("answers", "created_by")
    # ### end Alembic commands ###
