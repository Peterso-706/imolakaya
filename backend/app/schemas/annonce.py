from datetime import datetime
from uuid import UUID

from pydantic import Field

from app.models.enums import StatutAnnonce
from app.schemas.common import ORMModel


class AnnonceBase(ORMModel):
    titre: str = Field(max_length=200)
    description: str


class AnnonceCreate(AnnonceBase):
    bien_id: UUID


class AnnonceUpdate(ORMModel):
    titre: str | None = Field(default=None, max_length=200)
    description: str | None = None


class AnnonceAdminUpdate(ORMModel):
    statut: StatutAnnonce | None = None
    motif_rejet: str | None = Field(default=None, max_length=500)


class AnnonceRead(ORMModel):
    id: UUID
    bien_id: UUID
    titre: str
    description: str
    statut: StatutAnnonce
    date_soumission: datetime | None
    date_validation: datetime | None
    date_publication: datetime | None
    date_expiration: datetime | None
    motif_rejet: str | None
    cree_le: datetime


class AnnonceSoumettreRequest(ORMModel):
    """Aucun champ — l'action est portée par l'URL."""
    pass


class AnnonceApprouverRequest(ORMModel):
    date_expiration: datetime | None = None


class AnnonceRejeterRequest(ORMModel):
    motif: str = Field(min_length=5, max_length=500)