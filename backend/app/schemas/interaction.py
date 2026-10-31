from datetime import datetime
from uuid import UUID

from pydantic import EmailStr, Field

from app.models.enums import (
    SourceVisite,
    StatutAvis,
    StatutContact,
    TypeNotification,
)
from app.schemas.common import ORMModel


# --- Contact ---------------------------------------------------------------
class ContactCreatePublic(ORMModel):
    bien_id: UUID
    nom_visiteur: str = Field(min_length=1, max_length=150)
    email_visiteur: EmailStr
    telephone_visiteur: str | None = Field(default=None, max_length=30)
    message: str = Field(min_length=5, max_length=5000)


class ContactUpdateProprietaire(ORMModel):
    statut: StatutContact | None = None
    date_lecture: datetime | None = None
    date_traitement: datetime | None = None


class ContactRead(ORMModel):
    id: UUID
    bien_id: UUID
    proprietaire_id: UUID
    utilisateur_id: UUID | None
    nom_visiteur: str
    email_visiteur: EmailStr
    telephone_visiteur: str | None
    message: str
    statut: StatutContact
    date_lecture: datetime | None
    date_traitement: datetime | None
    cree_le: datetime


# --- Visite ----------------------------------------------------------------
class VisiteCreate(ORMModel):
    bien_id: UUID
    source: SourceVisite = SourceVisite.PUBLIC
    adresse_ip: str | None = Field(default=None, max_length=45)
    user_agent: str | None = Field(default=None, max_length=512)


class VisiteRead(ORMModel):
    id: UUID
    bien_id: UUID
    utilisateur_id: UUID | None
    source: SourceVisite
    pays: str | None
    ville: str | None
    cree_le: datetime


class VisiteStats(ORMModel):
    bien_id: UUID
    total_visites: int
    visites_7_jours: int
    visites_30_jours: int


# --- Avis ------------------------------------------------------------------
class AvisCreate(ORMModel):
    bien_id: UUID
    note: int = Field(ge=1, le=5)
    commentaire: str = Field(min_length=5, max_length=3000)
    nom_auteur: str | None = Field(default=None, max_length=150)


class AvisModerationRequest(ORMModel):
    statut: StatutAvis
    motif_rejet: str | None = Field(default=None, max_length=500)


class AvisRead(ORMModel):
    id: UUID
    bien_id: UUID
    utilisateur_id: UUID | None
    nom_auteur: str | None
    note: int
    commentaire: str
    statut: StatutAvis
    date_moderation: datetime | None
    motif_rejet: str | None
    cree_le: datetime


# --- Notification ----------------------------------------------------------
class NotificationCreate(ORMModel):
    utilisateur_id: UUID
    type: TypeNotification
    titre: str = Field(max_length=200)
    message: str
    lien: str | None = Field(default=None, max_length=500)


class NotificationRead(ORMModel):
    id: UUID
    utilisateur_id: UUID
    type: TypeNotification
    titre: str
    message: str
    lien: str | None
    est_lue: bool
    date_lecture: datetime | None
    cree_le: datetime


# --- Favori ----------------------------------------------------------------
class FavoriCreate(ORMModel):
    bien_id: UUID


class FavoriRead(ORMModel):
    id: UUID
    utilisateur_id: UUID
    bien_id: UUID
    cree_le: datetime