"""fix enum casing and values

Revision ID: d9685ff850ed
Revises: 728c84b24ba9
Create Date: 2026-10-31 09:42:54.090881
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'd9685ff850ed'
down_revision: Union[str, None] = '728c84b24ba9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Aligner les valeurs des enums PostgreSQL avec les enums Python (majuscules)
    op.execute("ALTER TYPE type_operation RENAME VALUE 'vente' TO 'VENTE'")
    op.execute("ALTER TYPE type_operation RENAME VALUE 'location' TO 'LOCATION'")

    op.execute("ALTER TYPE type_location RENAME VALUE 'logement_entier' TO 'MAISON'")
    op.execute("ALTER TYPE type_location RENAME VALUE 'appartement' TO 'APPARTEMENT'")
    op.execute("ALTER TYPE type_location RENAME VALUE 'chambre' TO 'CHAMBRE'")
    op.execute("ALTER TYPE type_location ADD VALUE IF NOT EXISTS 'TERRAIN'")
    op.execute("ALTER TYPE type_location ADD VALUE IF NOT EXISTS 'LOCAL_COMMERCIAL'")

    op.execute("ALTER TYPE frequence_paiement RENAME VALUE 'mensuel' TO 'MENSUEL'")
    op.execute("ALTER TYPE frequence_paiement RENAME VALUE 'trimestriel' TO 'TRIMESTRIEL'")
    op.execute("ALTER TYPE frequence_paiement RENAME VALUE 'semestriel' TO 'SEMESTRIEL'")
    op.execute("ALTER TYPE frequence_paiement RENAME VALUE 'annuel' TO 'ANNUEL'")

    op.execute("ALTER TYPE statut_bien RENAME VALUE 'disponible' TO 'DISPONIBLE'")
    op.execute("ALTER TYPE statut_bien RENAME VALUE 'reserve' TO 'RESERVE'")
    op.execute("ALTER TYPE statut_bien RENAME VALUE 'loue' TO 'LOUE'")
    op.execute("ALTER TYPE statut_bien RENAME VALUE 'vendu' TO 'VENDU'")
    op.execute("ALTER TYPE statut_bien RENAME VALUE 'retire' TO 'RETIRE'")

    # Mettre à jour la contrainte CHECK pour utiliser les nouvelles valeurs
    op.drop_constraint('ck_bien_location_requires_type_location', 'biens', type_='check')
    op.create_check_constraint(
        'ck_bien_location_requires_type_location',
        'biens',
        "(type_operation = 'LOCATION' AND type_location IS NOT NULL) OR (type_operation = 'VENTE')",
    )


def downgrade() -> None:
    pass