"""rename id_medicamente to id_medicament

Revision ID: 79e02be0b598
Revises: 0bcb15818fd3
Create Date: 2025-05-18 12:15:11.458167

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '79e02be0b598'
down_revision: Union[str, None] = '0bcb15818fd3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass
    


def downgrade():
    pass
