"""rename id_medicamente to id_medicament

Revision ID: 0bcb15818fd3
Revises: 746d9f1e77b0
Create Date: 2025-05-18 12:11:32.591838

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0bcb15818fd3'
down_revision: Union[str, None] = '746d9f1e77b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        'Medicamente',
        'id_medicamente',
        new_column_name='id_medicament',
        existing_type=sa.String(length=50),
        existing_nullable=False,
    )
    


def downgrade():
    # revert new_col → old_col
    op.alter_column(
        'Medicamente',
        'id_medicament',
        new_column_name='id_medicamente',
        existing_type=sa.String(length=255),
        existing_nullable=False
    )
