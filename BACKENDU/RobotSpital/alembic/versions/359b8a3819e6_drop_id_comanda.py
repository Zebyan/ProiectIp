"""Drop id_comanda

Revision ID: 359b8a3819e6
Revises: bc50e72bd9da
Create Date: 2025-06-02 12:44:00.653612

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '359b8a3819e6'
down_revision: Union[str, None] = 'bc50e72bd9da'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('Prescriptii', 'id_comanda')
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
