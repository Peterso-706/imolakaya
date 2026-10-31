from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.agence import Employe, Proprietaire
    from app.models.annonce import Annonce       # ✅ isit la
    from app.models.audit import AuditLog
    from app.models.role import Role
    from app.models.transaction import Transaction
from app.models.interaction import Avis, Contact, Favori, Notification, Visite


class Utilisateur(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "utilisateurs"

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    mot_de_passe_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    nom: Mapped[str] = mapped_column(String(120), nullable=False)
    prenom: Mapped[str | None] = mapped_column(String(120), nullable=True)
    telephone: Mapped[str | None] = mapped_column(String(30), nullable=True)

    est_actif: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    est_verifie: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    derniere_connexion: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    roles: Mapped[list["Role"]] = relationship(
        secondary="utilisateur_roles",
        back_populates="utilisateurs",
    )

    proprietaire: Mapped["Proprietaire | None"] = relationship(
        back_populates="utilisateur",
        uselist=False,
    )
    employe: Mapped["Employe | None"] = relationship(
        back_populates="utilisateur",
        uselist=False,
    )
    audit_logs: Mapped[list["AuditLog"]] = relationship(
        back_populates="utilisateur",
    )
    annonces_validees: Mapped[list["Annonce"]] = relationship(
        back_populates="valide_par",
    )
    transactions_paiement: Mapped[list["Transaction"]] = relationship(
        back_populates="utilisateur",
    )
    contacts_envoyes: Mapped[list["Contact"]] = relationship(
        back_populates="utilisateur",
    )
    visites: Mapped[list["Visite"]] = relationship(
        back_populates="utilisateur",
    )
    avis_rediges: Mapped[list["Avis"]] = relationship(
        back_populates="utilisateur",
        foreign_keys="Avis.utilisateur_id",
    )
    avis_moderes: Mapped[list["Avis"]] = relationship(
        back_populates="modere_par",
        foreign_keys="Avis.modere_par_id",
    )
    notifications: Mapped[list["Notification"]] = relationship(
        back_populates="utilisateur",
        cascade="all, delete-orphan",
    )
    favoris: Mapped[list["Favori"]] = relationship(
        back_populates="utilisateur",
        cascade="all, delete-orphan",
    )