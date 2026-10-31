from datetime import datetime
from uuid import UUID

from pydantic import EmailStr, Field

from app.schemas.common import ORMModel


class UtilisateurBase(ORMModel):
    email: EmailStr
    nom: str = Field(max_length=120)
    prenom: str | None = Field(default=None, max_length=120)
    telephone: str | None = Field(default=None, max_length=30)


class UtilisateurCreate(UtilisateurBase):
    mot_de_passe: str = Field(min_length=8, max_length=128)


class UtilisateurUpdate(ORMModel):
    nom: str | None = Field(default=None, max_length=120)
    prenom: str | None = Field(default=None, max_length=120)
    telephone: str | None = Field(default=None, max_length=30)


class UtilisateurAdminUpdate(UtilisateurUpdate):
    est_actif: bool | None = None
    est_verifie: bool | None = None


class UtilisateurRead(UtilisateurBase):
    id: UUID
    est_actif: bool
    est_verifie: bool
    derniere_connexion: datetime | None = None
    cree_le: datetime


class UtilisateurReadDetail(UtilisateurRead):
    roles: list["RoleRef"] = []


class RoleRef(ORMModel):
    id: UUID
    nom: str