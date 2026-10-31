from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Index,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin
from app.models.enums import (
    Devise,
    MethodePaiement,
    SourcePaiement,
    StatutPaiement,
)

if TYPE_CHECKING:
    from app.models.agence import Employe, Proprietaire
    from app.models.annonce import Annonce
    from app.models.transaction import Transaction


def _enum(enum_cls, name: str):
    return SAEnum(
        enum_cls,
        name=name,
        native_enum=True,
        values_callable=lambda e: [m.value for m in e],
    )


class Paiement(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "paiements"
    __table_args__ = (
        CheckConstraint("montant > 0", name="ck_paiement_montant_positif"),
        CheckConstraint(
            "(source = 'agence' AND employe_id IS NOT NULL) "
            "OR (source = 'en_ligne')",
            name="ck_paiement_agence_requires_employe",
        ),
        Index("ix_paiement_statut_date", "statut", "date_paiement"),
        Index("ix_paiement_annonce_statut", "annonce_id", "statut"),
    )

    # --- Références --------------------------------------------------------
    annonce_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("annonces.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    proprietaire_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("proprietaires.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    employe_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("employes.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        doc="Agent qui a enregistré un paiement au bureau (source=agence)",
    )

    # --- Montant et devise -------------------------------------------------
    montant: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    devise: Mapped[Devise] = mapped_column(
        _enum(Devise, "devise"),
        default=Devise.HTG,
        nullable=False,
    )

    # --- Méthode et source -------------------------------------------------
    source: Mapped[SourcePaiement] = mapped_column(
        _enum(SourcePaiement, "source_paiement"),
        default=SourcePaiement.EN_LIGNE,
        nullable=False,
        index=True,
    )
    methode: Mapped[MethodePaiement] = mapped_column(
        _enum(MethodePaiement, "methode_paiement"),
        nullable=False,
        index=True,
    )

    # --- Référence et statut ----------------------------------------------
    reference: Mapped[str] = mapped_column(
        String(120),
        unique=True,
        nullable=False,
        index=True,
        doc="Référence fournisseur (MonCash/NatCash/carte) ou bon interne (agence)",
    )
    reference_fournisseur: Mapped[str | None] = mapped_column(
        String(255), nullable=True, index=True,
    )

    statut: Mapped[StatutPaiement] = mapped_column(
        _enum(StatutPaiement, "statut_paiement"),
        default=StatutPaiement.EN_ATTENTE,
        nullable=False,
        index=True,
    )

    # --- Preuve serveur (RG-04, SEL-NF-04) --------------------------------
    verifie_par_webhook: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False,
    )
    preuve_serveur: Mapped[dict | None] = mapped_column(
        JSONB,
        nullable=True,
        doc="Résumé de la vérification côté serveur ",
    )

    # --- Traçabilité -------------------------------------------------------
    date_paiement: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True, index=True,
    )
    date_confirmation: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True,
    )
    agent_responsable: Mapped[str | None] = mapped_column(
        String(200), nullable=True,
        doc="Nom de l'agent pour paiement en agence (audit)",
    )
    note_interne: Mapped[str | None] = mapped_column(Text, nullable=True)

    # --- Relations ---------------------------------------------------------
    annonce: Mapped["Annonce"] = relationship(back_populates="paiements")
    proprietaire: Mapped["Proprietaire"] = relationship(back_populates="paiements")
    employe: Mapped["Employe | None"] = relationship(back_populates="paiements_enregistres")
    transactions: Mapped[list["Transaction"]] = relationship(
        back_populates="paiement",
        cascade="all, delete-orphan",
        order_by="Transaction.cree_le",
    )