from datetime import datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from pydantic import Field

from app.models.enums import (
    Devise,
    MethodePaiement,
    SourcePaiement,
    StatutPaiement,
)
from app.schemas.common import ORMModel


class PaiementCreateEnLigne(ORMModel):
    annonce_id: UUID
    montant: Decimal = Field(gt=0)
    devise: Devise = Devise.HTG
    methode: MethodePaiement


class PaiementCreateAgence(ORMModel):
    annonce_id: UUID
    proprietaire_id: UUID
    montant: Decimal = Field(gt=0)
    devise: Devise = Devise.HTG
    methode: MethodePaiement
    reference: str = Field(max_length=120)
    agent_responsable: str = Field(max_length=200)
    note_interne: str | None = None


class PaiementRead(ORMModel):
    id: UUID
    annonce_id: UUID
    proprietaire_id: UUID
    employe_id: UUID | None
    montant: Decimal
    devise: Devise
    source: SourcePaiement
    methode: MethodePaiement
    reference: str
    reference_fournisseur: str | None
    statut: StatutPaiement
    verifie_par_webhook: bool
    date_paiement: datetime | None
    date_confirmation: datetime | None
    agent_responsable: str | None
    cree_le: datetime


class PaiementReadDetail(PaiementRead):
    preuve_serveur: dict[str, Any] | None = None


class PaiementConfirmerManuelRequest(ORMModel):
    preuve: str = Field(min_length=5, max_length=1000,
                        description="Référence ou motif de la vérification manuelle")