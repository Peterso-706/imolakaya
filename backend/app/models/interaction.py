from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin
from app.models.enums import (
    SourceVisite,
    StatutAvis,
    StatutContact,
    TypeNotification,
)

if TYPE_CHECKING:
    from app.models.agence import Proprietaire
    from app.models.bien import Bien
    from app.models.utilisateur import Utilisateur


def _enum(enum_cls, name: str):
    return SAEnum(
        enum_cls,
        name=name,
        native_enum=True,
        values_callable=lambda e: [m.value for m in e],
    )


# ---------------------------------------------------------------------------
# Contact — demandes envoyées par les visiteurs (SEL-PUB-04, SEL-PRO-09)
# ---------------------------------------------------------------------------
class Contact(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "contacts"
    __table_args__ = (
        Index("ix_contact_bien_date", "bien_id", "cree_le"),
        Index("ix_contact_proprietaire_statut", "proprietaire_id", "statut"),
    )

    bien_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("biens.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    proprietaire_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("proprietaires.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
        doc="Dénormalisé depuis bien.proprietaire_id pour filtrage rapide",
    )
    utilisateur_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("utilisateurs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        doc="Null si visiteur anonyme",
    )

    nom_visiteur: Mapped[str] = mapped_column(String(150), nullable=False)
    email_visiteur: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    telephone_visiteur: Mapped[str | None] = mapped_column(String(30), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)

    statut: Mapped[StatutContact] = mapped_column(
        _enum(StatutContact, "statut_contact"),
        default=StatutContact.NOUVEau if False else StatutContact.NOUVEAU,
        nullable=False,
        index=True,
    )
    date_lecture: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    date_traitement: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    bien: Mapped["Bien"] = relationship(back_populates="contacts")
    proprietaire: Mapped["Proprietaire"] = relationship(back_populates="contacts_recus")
    utilisateur: Mapped["Utilisateur | None"] = relationship(back_populates="contacts_envoyes")


# ---------------------------------------------------------------------------
# Visite — événements de consultation (SEL-PUB-07, RG-08)
# ---------------------------------------------------------------------------
class Visite(Base, UUIDMixin):
    __tablename__ = "visites"
    __table_args__ = (
        UniqueConstraint("cle_deduplication", name="uq_visite_cle_dedup"),
        Index("ix_visite_bien_cree_le", "bien_id", "cree_le"),
        Index("ix_visite_bien_source", "bien_id", "source"),
    )

    bien_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("biens.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    utilisateur_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("utilisateurs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    source: Mapped[SourceVisite] = mapped_column(
        _enum(SourceVisite, "source_visite"),
        default=SourceVisite.PUBLIC,
        nullable=False,
    )
    adresse_ip: Mapped[str | None] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(512), nullable=True)
    pays: Mapped[str | None] = mapped_column(String(80), nullable=True)
    ville: Mapped[str | None] = mapped_column(String(120), nullable=True)

    cle_deduplication: Mapped[str] = mapped_column(
        String(128),
        nullable=False,
        unique=True,
        doc="Hash calculé côté service : sha256(bien_id:ip:user_agent:jour)",
    )
    cree_le: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    bien: Mapped["Bien"] = relationship(back_populates="visites")
    utilisateur: Mapped["Utilisateur | None"] = relationship(back_populates="visites")


# ---------------------------------------------------------------------------
# Avis — témoignages modérés
# ---------------------------------------------------------------------------
class Avis(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "avis"
    __table_args__ = (
        CheckConstraint("note BETWEEN 1 AND 5", name="ck_avis_note_range"),
        Index("ix_avis_bien_statut", "bien_id", "statut"),
        Index("ix_avis_utilisateur_bien", "utilisateur_id", "bien_id"),
    )

    bien_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("biens.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    utilisateur_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("utilisateurs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    modere_par_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("utilisateurs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    nom_auteur: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
        doc="Requis si utilisateur_id est null",
    )
    note: Mapped[int] = mapped_column(Integer, nullable=False)
    commentaire: Mapped[str] = mapped_column(Text, nullable=False)

    statut: Mapped[StatutAvis] = mapped_column(
        _enum(StatutAvis, "statut_avis"),
        default=StatutAvis.EN_ATTENTE,
        nullable=False,
        index=True,
    )
    date_moderation: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    motif_rejet: Mapped[str | None] = mapped_column(String(500), nullable=True)

    bien: Mapped["Bien"] = relationship(back_populates="avis")
    utilisateur: Mapped["Utilisateur | None"] = relationship(
        back_populates="avis_rediges",
        foreign_keys=[utilisateur_id],
    )
    modere_par: Mapped["Utilisateur | None"] = relationship(
        back_populates="avis_moderes",
        foreign_keys=[modere_par_id],
    )


# ---------------------------------------------------------------------------
# Notification — messages destinés aux utilisateurs
# ---------------------------------------------------------------------------
class Notification(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "notifications"
    __table_args__ = (
        Index(
            "ix_notification_utilisateur_lue_cree",
            "utilisateur_id",
            "est_lue",
            "cree_le",
        ),
    )

    utilisateur_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("utilisateurs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    type: Mapped[TypeNotification] = mapped_column(
        _enum(TypeNotification, "type_notification"),
        nullable=False,
        index=True,
    )
    titre: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    lien: Mapped[str | None] = mapped_column(String(500), nullable=True)
    donnees: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    est_lue: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    date_lecture: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    utilisateur: Mapped["Utilisateur"] = relationship(back_populates="notifications")


# ---------------------------------------------------------------------------
# Favori — biens enregistrés par un utilisateur
# ---------------------------------------------------------------------------
class Favori(Base, UUIDMixin):
    __tablename__ = "favoris"
    __table_args__ = (
        UniqueConstraint("utilisateur_id", "bien_id", name="uq_favori_utilisateur_bien"),
        Index("ix_favori_utilisateur", "utilisateur_id"),
    )

    utilisateur_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("utilisateurs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    bien_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("biens.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    cree_le: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    utilisateur: Mapped["Utilisateur"] = relationship(back_populates="favoris")
    bien: Mapped["Bien"] = relationship(back_populates="favoris")