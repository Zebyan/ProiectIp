"""create_paturi_table

Revision ID: bc50e72bd9da
Revises: 9de6188bd9c9
Create Date: 2025-05-29 11:34:13.502857

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bc50e72bd9da'
down_revision: Union[str, None] = '9de6188bd9c9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'Paturi',
        sa.Column("id_pat", sa.CHAR(3), primary_key=True, nullable=False),
        sa.Column("ocupat", sa.BOOLEAN, nullable=False, default=False),
        sa.Column("nr_salon", sa.INTEGER)
    )
    pass


def downgrade() -> None:
    op.drop_table('Paturi')
    pass
