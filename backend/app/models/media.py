from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import (
    Boolean,
    Enum as SAEnum,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin
from app.models.enums import TypeMedia

if TYPE_CHECKING:
    from app.models.bien import Bien


class Media(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "medias"
    __table_args__ = (
        UniqueConstraint("bien_id", "ordre", name="uq_media_bien_ordre"),
        Index("ix_media_bien_couverture", "bien_id", "est_couverture"),
    )

    bien_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("biens.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    url: Mapped[str] = mapped_column(String(1000), nullable=False)
    public_id: Mapped[str | None] = mapped_column(
        String(255), nullable=True,
        doc="Identifiant côté fournisseur (Cloudinary/R2) pour suppression",
    )
    type: Mapped[TypeMedia] = mapped_column(
        SAEnum(
            TypeMedia,
            name="type_media",
            native_enum=True,
            values_callable=lambda e: [m.value for m in e],
        ),
        nullable=False,
    )

    ordre: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    est_couverture: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    titre: Mapped[str | None] = mapped_column(String(200), nullable=True)

    # Métadonnées facultatives
    format: Mapped[str | None] = mapped_column(String(20), nullable=True)
    taille_octets: Mapped[int | None] = mapped_column(Integer, nullable=True)
    largeur: Mapped[int | None] = mapped_column(Integer, nullable=True)
    hauteur: Mapped[int | None] = mapped_column(Integer, nullable=True)
    duree_secondes: Mapped[int | None] = mapped_column(Integer, nullable=True)

    bien: Mapped["Bien"] = relationship(back_populates="medias")