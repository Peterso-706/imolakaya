from datetime import datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from pydantic import Field, model_validator

from app.models.enums import (
    Devise,
    FrequencePaiement,
    StatutBien,
    TypeLocation,
    TypeOperation,
)
from app.schemas.common import ORMModel


class CategorieBase(ORMModel):
    nom: str = Field(max_length=120)
    slug: str = Field(max_length=120)
    description: str | None = Field(default=None, max_length=500)
    icone: str | None = Field(default=None, max_length=120)
    ordre: int = 0


class CategorieCreate(CategorieBase):
    pass


class CategorieUpdate(ORMModel):
    nom: str | None = Field(default=None, max_length=120)
    description: str | None = Field(default=None, max_length=500)
    icone: str | None = Field(default=None, max_length=120)
    ordre: int | None = None
    est_active: bool | None = None


class CategorieRead(CategorieBase):
    id: UUID
    est_active: bool


class LocalisationBase(ORMModel):
    departement: str = Field(max_length=80)
    commune: str = Field(max_length=120)
    zone: str = Field(max_length=150)
    adresse_descriptive: str | None = Field(default=None, max_length=500)


class LocalisationCreate(LocalisationBase):
    pass


class LocalisationRead(LocalisationBase):
    id: UUID


class BienBase(ORMModel):
    titre: str = Field(max_length=200)
    description: str
    type_operation: TypeOperation
    type_location: TypeLocation | None = None
    prix: Decimal = Field(ge=0)
    devise: Devise = Devise.HTG
    frequence_paiement: FrequencePaiement | None = None
    nombre_chambres: int | None = Field(default=None, ge=0)
    nombre_salles_bain: int | None = Field(default=None, ge=0)
    superficie_m2: Decimal | None = Field(default=None, ge=0)
    annee_construction: int | None = Field(default=None, ge=1800, le=2100)
    caracteristiques: dict[str, Any] | None = None


class BienCreate(BienBase):
    categorie_id: UUID
    localisation_id: UUID
    statut: StatutBien = StatutBien.DISPONIBLE
    reference_interne: str | None = Field(default=None, max_length=50)

    @model_validator(mode="after")
    def _coherence_type_location(self):
        if self.type_operation == TypeOperation.LOCATION and not self.type_location:
            raise ValueError("type_location obligatoire pour une location")
        if self.type_operation == TypeOperation.VENTE and self.type_location:
            raise ValueError("type_location doit être vide pour une vente")
        return self


class BienUpdate(ORMModel):
    titre: str | None = Field(default=None, max_length=200)
    description: str | None = None
    type_operation: TypeOperation | None = None
    type_location: TypeLocation | None = None
    prix: Decimal | None = Field(default=None, ge=0)
    devise: Devise | None = None
    frequence_paiement: FrequencePaiement | None = None
    nombre_chambres: int | None = Field(default=None, ge=0)
    nombre_salles_bain: int | None = Field(default=None, ge=0)
    superficie_m2: Decimal | None = Field(default=None, ge=0)
    annee_construction: int | None = Field(default=None, ge=1800, le=2100)
    caracteristiques: dict[str, Any] | None = None
    categorie_id: UUID | None = None
    localisation_id: UUID | None = None
    statut: StatutBien | None = None
    est_actif: bool | None = None


class BienRead(ORMModel):
    id: UUID
    titre: str
    description: str
    type_operation: TypeOperation
    type_location: TypeLocation | None
    prix: Decimal
    devise: Devise
    frequence_paiement: FrequencePaiement | None
    nombre_chambres: int | None
    nombre_salles_bain: int | None
    superficie_m2: Decimal | None
    annee_construction: int | None
    caracteristiques: dict[str, Any] | None
    statut: StatutBien
    est_actif: bool
    categorie_id: UUID
    localisation_id: UUID
    proprietaire_id: UUID
    cree_le: datetime


class BienReadDetail(BienRead):
    categorie: CategorieRead
    localisation: LocalisationRead
    medias: list["MediaRead"] = []


class BienSearchParams(ORMModel):
    q: str | None = None
    type_operation: TypeOperation | None = None
    type_location: TypeLocation | None = None
    categorie_id: UUID | None = None
    departement: str | None = None
    commune: str | None = None
    zone: str | None = None
    prix_min: Decimal | None = Field(default=None, ge=0)
    prix_max: Decimal | None = Field(default=None, ge=0)
    statut: StatutBien | None = None
    page: int = Field(1, ge=1)
    taille: int = Field(20, ge=1, le=100)


from app.schemas.media import MediaRead  # noqa: E402
BienReadDetail.model_rebuild()