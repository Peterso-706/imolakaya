from __future__ import annotations

from decimal import Decimal
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Enum as SAEnum,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin
from app.models.enums import (
    Devise,
    FrequencePaiement,
    StatutBien,
    TypeLocation,
    TypeOperation,
)
from app.models.interaction import Avis, Contact, Favori, Visite

if TYPE_CHECKING:
    from app.models.agence import Employe, Proprietaire
    from app.models.annonce import Annonce
    from app.models.media import Media


def _enum(enum_cls, name: str):
    return SAEnum(
        enum_cls,
        name=name,
        native_enum=True,
        values_callable=lambda e: [m.value for m in e],
    )


class Categorie(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "categories"

    nom: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    icone: Mapped[str | None] = mapped_column(String(120), nullable=True)
    ordre: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    est_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    biens: Mapped[list["Bien"]] = relationship(back_populates="categorie")


class Localisation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "localisations"
    __table_args__ = (
        UniqueConstraint(
            "departement", "commune", "zone",
            name="uq_localisation_dep_commune_zone",
        ),
    )

    departement: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    commune: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    zone: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    adresse_descriptive: Mapped[str | None] = mapped_column(String(500), nullable=True)

    biens: Mapped[list["Bien"]] = relationship(back_populates="localisation")


class Bien(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "biens"
    __table_args__ = (
        CheckConstraint(
            "(type_operation = 'location' AND type_location IS NOT NULL) "
            "OR (type_operation = 'vente')",
            name="ck_bien_location_requires_type_location",
        ),
        CheckConstraint("prix >= 0", name="ck_bien_prix_positif"),
        Index("ix_bien_statut_type_operation", "statut", "type_operation"),
        Index("ix_bien_prix", "prix"),
    )

    # --- Relations ---------------------------------------------------------
    proprietaire_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("proprietaires.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    employe_createur_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("employes.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    categorie_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("categories.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    localisation_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("localisations.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    # --- Identité ----------------------------------------------------------
    titre: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    reference_interne: Mapped[str | None] = mapped_column(
        String(50), unique=True, nullable=True, index=True,
    )

    # --- Nature de l'offre -------------------------------------------------
    type_operation: Mapped[TypeOperation] = mapped_column(
        _enum(TypeOperation, "type_operation"), nullable=False, index=True,
    )
    type_location: Mapped[TypeLocation | None] = mapped_column(
        _enum(TypeLocation, "type_location"), nullable=True,
    )

    # --- Prix --------------------------------------------------------------
    prix: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    devise: Mapped[Devise] = mapped_column(
        _enum(Devise, "devise"), default=Devise.HTG, nullable=False,
    )
    frequence_paiement: Mapped[FrequencePaiement | None] = mapped_column(
        _enum(FrequencePaiement, "frequence_paiement"), nullable=True,
    )

    # --- Caractéristiques structurées -------------------------------------
    nombre_chambres: Mapped[int | None] = mapped_column(Integer, nullable=True)
    nombre_salles_bain: Mapped[int | None] = mapped_column(Integer, nullable=True)
    superficie_m2: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    annee_construction: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Bloc flexible (équipements, options, notes) — non critique pour filtrage
    caracteristiques: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    # --- Statut et cycle de vie -------------------------------------------
    statut: Mapped[StatutBien] = mapped_column(
        _enum(StatutBien, "statut_bien"),
        default=StatutBien.DISPONIBLE,
        nullable=False,
        index=True,
    )
    est_actif: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    est_supprime: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)

    # --- Relations ORM -----------------------------------------------------
    proprietaire: Mapped["Proprietaire"] = relationship(back_populates="biens")
    employe_createur: Mapped["Employe | None"] = relationship(
        back_populates="biens_crees",
    )
    categorie: Mapped[Categorie] = relationship(back_populates="biens")
    localisation: Mapped[Localisation] = relationship(back_populates="biens")
    medias: Mapped[list["Media"]] = relationship(
        back_populates="bien",
        cascade="all, delete-orphan",
        order_by="Media.ordre",
    )
    annonces: Mapped[list["Annonce"]] = relationship(
        back_populates="bien",
        cascade="save-update, merge",
    )


    contacts: Mapped[list["Contact"]] = relationship(
        back_populates="bien",
        cascade="save-update, merge",
    )
    visites: Mapped[list["Visite"]] = relationship(
        back_populates="bien",
        cascade="all, delete-orphan",
    )
    avis: Mapped[list["Avis"]] = relationship(
        back_populates="bien",
        cascade="save-update, merge",
    )
    favoris: Mapped[list["Favori"]] = relationship(
        back_populates="bien",
        cascade="all, delete-orphan",
    )