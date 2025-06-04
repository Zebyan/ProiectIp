"""Create table Prescriptii

Revision ID: 746d9f1e77b0
Revises: e771c42a1e72
Create Date: 2025-05-18 11:55:52.151571

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '746d9f1e77b0'
down_revision: Union[str, None] = 'e771c42a1e72'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'Prescriptii',
        sa.Column('id_prescriptie', sa.INTEGER(), primary_key=True),
        sa.Column('id_comanda', sa.Integer(), autoincrement=True),
        sa.Column('cantitate', sa.INTEGER(), nullable=False),
        sa.Column('CNP',sa.CHAR(length=13), sa.ForeignKey('Pacienti.CNP', ondelete='CASCADE'), nullable=False),
        sa.Column('afectiune', sa.String(length=50)),
        sa.Column('id_medicament',sa.INTEGER(), sa.ForeignKey('Medicamente.id_medicamente', ondelete='CASCADE'), nullable=False) 
    )
    


def downgrade() -> None:
    op.drop_table('Prescriptii')
    pass
