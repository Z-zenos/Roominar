"""Event model: change column name max_application_number_per_account

Revision ID: 952fdebc00e4
Revises: 9a605590ea6d
Create Date: 2024-12-09 08:00:03.828723

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "952fdebc00e4"
down_revision: Union[str, None] = "9a605590ea6d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "events",
        sa.Column("max_ticket_number_per_account", sa.Integer(), nullable=True),
    )
    op.drop_column("events", "max_application_number_per_account")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "events",
        sa.Column(
            "max_application_number_per_account",
            sa.INTEGER(),
            autoincrement=False,
            nullable=True,
        ),
    )
    op.drop_column("events", "max_ticket_number_per_account")
    # ### end Alembic commands ###
