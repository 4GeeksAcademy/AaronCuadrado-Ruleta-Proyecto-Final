"""Add is_admin column to User model

Revision ID: f57c3be5c470
Revises: 06a75f023c19
Create Date: 2024-11-13 20:13:23.095361

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f57c3be5c470'
down_revision = '06a75f023c19'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_admin', sa.Boolean(), nullable=True))

    with op.batch_alter_table('vehicle', schema=None) as batch_op:
        batch_op.add_column(sa.Column('monthly_rate', sa.Float(), nullable=False))
        batch_op.drop_column('daily_rate')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('vehicle', schema=None) as batch_op:
        batch_op.add_column(sa.Column('daily_rate', sa.FLOAT(), nullable=False))
        batch_op.drop_column('monthly_rate')

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('is_admin')

    # ### end Alembic commands ###