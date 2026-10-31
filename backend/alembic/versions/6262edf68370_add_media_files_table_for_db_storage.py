"""add media_files table for db storage

Revision ID: 6262edf68370
Revises: d9685ff850ed
Create Date: 2026-10-31 14:36:19.015762
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '6262edf68370'
down_revision: Union[str, None] = 'd9685ff850ed'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "media_files",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("cle", sa.String(length=500), nullable=False),
        sa.Column("content_type", sa.String(length=120), nullable=False),
        sa.Column("contenu", sa.LargeBinary(), nullable=False),
        sa.Column("taille_octets", sa.Integer(), nullable=False),
        sa.Column("cree_le", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("modifie_le", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("cle", name="uq_media_file_cle"),
    )
    op.create_index("ix_media_files_cle", "media_files", ["cle"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_media_files_cle", table_name="media_files")
    op.drop_table("media_files")