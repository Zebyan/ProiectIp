"""id_pat_foreign_key

Revision ID: 8edc1ed41ec5
Revises: 359b8a3819e6
Create Date: 2025-06-02 19:47:02.199676

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8edc1ed41ec5'
down_revision: Union[str, None] = '359b8a3819e6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('Comenzi', 'id_pat',
        existing_type=sa.CHAR(3),
        nullable=False)
    op.create_foreign_key(
        'fk_comenzi_id_pat',  # constraint name
        'Comenzi',            # source table
        'Paturi',                # referent table
        ['id_pat'],           # local column
        ['id_pat']                # referent column
    )
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
