"""create_table_comenzi

Revision ID: 9de6188bd9c9
Revises: 79e02be0b598
Create Date: 2025-05-29 11:08:12.175484

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9de6188bd9c9'
down_revision: Union[str, None] = '79e02be0b598'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

status_enum = sa.Enum('Plasata','InProcesare','InTranzit','Livrata', name='status_enum')

def upgrade() -> None:
    #status_enum.create(op.get_bind())
    op.create_table(
        'Comenzi',
        sa.Column('id_comanda', sa.INTEGER, primary_key=True, autoincrement=True),
        sa.Column('ora', sa.TIME),
        sa.Column('data', sa.DateTime),
        sa.Column('id_angajat', sa.Integer, sa.ForeignKey('Angajati.id_angajat', ondelete='CASCADE'), nullable=False),
        sa.Column('id_pat', sa.CHAR(3)),
        sa.Column('status', status_enum),
        sa.Column('id_prescriptie', sa.Integer, sa.ForeignKey('Prescriptii.id_prescriptie', ondelete='CASCADE'))
    )



def downgrade() -> None:
    """Downgrade schema."""
    pass
