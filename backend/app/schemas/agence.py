from uuid import UUID

from pydantic import EmailStr, Field

from app.schemas.common import ORMModel


class AgenceBase(ORMModel):
    nom: str = Field(max_length=150)
    adresse: str | None = Field(default=None, max_length=255)
    telephone: str | None = Field(default=None, max_length=30)
    email: EmailStr | None = None


class AgenceCreate(AgenceBase):
    pass


class AgenceUpdate(ORMModel):
    nom: str | None = Field(default=None, max_length=150)
    adresse: str | None = Field(default=None, max_length=255)
    telephone: str | None = Field(default=None, max_length=30)
    email: EmailStr | None = None
    est_active: bool | None = None


class AgenceRead(AgenceBase):
    id: UUID
    est_active: bool


class ProprietaireCreate(ORMModel):
    utilisateur_id: UUID
    adresse: str | None = Field(default=None, max_length=255)
    telephone_secondaire: str | None = Field(default=None, max_length=30)
    note_interne: str | None = Field(default=None, max_length=500)


class ProprietaireUpdate(ORMModel):
    adresse: str | None = Field(default=None, max_length=255)
    telephone_secondaire: str | None = Field(default=None, max_length=30)
    note_interne: str | None = Field(default=None, max_length=500)


class ProprietaireRead(ORMModel):
    id: UUID
    utilisateur_id: UUID
    adresse: str | None = None
    telephone_secondaire: str | None = None


class EmployeCreate(ORMModel):
    utilisateur_id: UUID
    agence_id: UUID
    matricule: str | None = Field(default=None, max_length=50)
    poste: str | None = Field(default=None, max_length=120)


class EmployeUpdate(ORMModel):
    matricule: str | None = Field(default=None, max_length=50)
    poste: str | None = Field(default=None, max_length=120)
    est_actif: bool | None = None


class EmployeRead(ORMModel):
    id: UUID
    utilisateur_id: UUID
    agence_id: UUID
    matricule: str | None = None
    poste: str | None = None
    est_actif: bool