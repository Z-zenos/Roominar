"""Event Model: Add view_number

Revision ID: 158acdaaecbc
Revises: 45a0f9e03725
Create Date: 2024-09-03 13:50:38.058869

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "158acdaaecbc"
down_revision: Union[str, None] = "45a0f9e03725"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("events", sa.Column("view_number", sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###

    op.drop_column("events", "view_number")
    # ### end Alembic commands ###
