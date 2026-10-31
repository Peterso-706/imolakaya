from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.bien import Bien
    from app.models.interaction import Contact
    from app.models.paiement import Paiement
    from app.models.utilisateur import Utilisateur


class Agence(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "agences"

    nom: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    adresse: Mapped[str | None] = mapped_column(String(255), nullable=True)
    telephone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    est_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    employes: Mapped[list["Employe"]] = relationship(back_populates="agence")


class Proprietaire(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "proprietaires"

    utilisateur_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("utilisateurs.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    adresse: Mapped[str | None] = mapped_column(String(255), nullable=True)
    telephone_secondaire: Mapped[str | None] = mapped_column(String(30), nullable=True)
    note_interne: Mapped[str | None] = mapped_column(String(500), nullable=True)

    utilisateur: Mapped["Utilisateur"] = relationship(back_populates="proprietaire")
    biens: Mapped[list["Bien"]] = relationship(back_populates="proprietaire")
    paiements: Mapped[list["Paiement"]] = relationship(back_populates="proprietaire")
    contacts_recus: Mapped[list["Contact"]] = relationship(
        back_populates="proprietaire",
    )


class Employe(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "employes"

    utilisateur_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("utilisateurs.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    agence_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("agences.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    matricule: Mapped[str | None] = mapped_column(
        String(50), unique=True, nullable=True, index=True,
    )
    poste: Mapped[str | None] = mapped_column(String(120), nullable=True)
    est_actif: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    utilisateur: Mapped["Utilisateur"] = relationship(back_populates="employe")
    agence: Mapped[Agence] = relationship(back_populates="employes")
    biens_crees: Mapped[list["Bien"]] = relationship(
        back_populates="employe_createur",
    )
    paiements_enregistres: Mapped[list["Paiement"]] = relationship(
        back_populates="employe",
    )