from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import (
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, UUIDMixin
from app.models.enums import TypeTransaction

if TYPE_CHECKING:
    from app.models.paiement import Paiement
    from app.models.utilisateur import Utilisateur


class Transaction(Base, UUIDMixin):
    __tablename__ = "transactions"

    paiement_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("paiements.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    utilisateur_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("utilisateurs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        doc="Utilisateur à l'origine du changement (null si webhook automatique)",
    )

    type: Mapped[TypeTransaction] = mapped_column(
        SAEnum(
            TypeTransaction,
            name="type_transaction",
            native_enum=True,
            values_callable=lambda e: [m.value for m in e],
        ),
        nullable=False,
        index=True,
    )
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    donnees: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    adresse_ip: Mapped[str | None] = mapped_column(String(45), nullable=True)

    cree_le: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    paiement: Mapped["Paiement"] = relationship(back_populates="transactions")
    utilisateur: Mapped["Utilisateur | None"] = relationship(
        back_populates="transactions_paiement",
    )