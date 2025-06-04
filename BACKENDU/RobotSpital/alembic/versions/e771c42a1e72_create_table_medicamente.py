"""Create table Medicamente

Revision ID: e771c42a1e72
Revises: 291fe180b963
Create Date: 2025-05-18 11:36:17.678882

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e771c42a1e72'
down_revision: Union[str, None] = '291fe180b963'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'Medicamente',
        sa.Column('id_medicamente', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('denumire', sa.String(length=50), nullable=False),
        sa.Column('stoc', sa.Integer, nullable=False),
        sa.UniqueConstraint('denumire', name='unique_medicamente_denumire'),
        sa.CheckConstraint('"stoc" >= 0', name='check_medicamente_stoc_pozitiv')
    )
    


def downgrade() -> None:
    op.drop_table('Medicamente')
    pass
