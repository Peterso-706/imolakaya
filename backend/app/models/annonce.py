from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Index,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin
from app.models.enums import StatutAnnonce
from app.models.paiement import Paiement

if TYPE_CHECKING:
    from app.models.bien import Bien
    from app.models.utilisateur import Utilisateur


class Annonce(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "annonces"
    __table_args__ = (
        CheckConstraint(
            "date_expiration IS NULL OR date_publication IS NULL "
            "OR date_expiration > date_publication",
            name="ck_annonce_expiration_apres_publication",
        ),
        Index("ix_annonce_statut_date_publication", "statut", "date_publication"),
    )

    bien_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("biens.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    valide_par_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("utilisateurs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    titre: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    statut: Mapped[StatutAnnonce] = mapped_column(
        SAEnum(
            StatutAnnonce,
            name="statut_annonce",
            native_enum=True,
            values_callable=lambda e: [m.value for m in e],
        ),
        default=StatutAnnonce.BROUILLON,
        nullable=False,
        index=True,
    )

    date_soumission: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    date_validation: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    date_publication: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True, index=True,
    )
    date_expiration: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True,
    )
    motif_rejet: Mapped[str | None] = mapped_column(String(500), nullable=True)

    bien: Mapped["Bien"] = relationship(back_populates="annonces")
    valide_par: Mapped["Utilisateur | None"] = relationship(
        back_populates="annonces_validees",
    )
    paiements: Mapped[list["Paiement"]] = relationship(
        back_populates="annonce",
        cascade="save-update, merge",
        order_by="Paiement.cree_le",
    )