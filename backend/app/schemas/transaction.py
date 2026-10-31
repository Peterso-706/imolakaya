from datetime import datetime
from typing import Any
from uuid import UUID

from app.models.enums import TypeTransaction
from app.schemas.common import ORMModel


class TransactionRead(ORMModel):
    id: UUID
    paiement_id: UUID
    utilisateur_id: UUID | None
    type: TypeTransaction
    message: str | None
    donnees: dict[str, Any] | None
    adresse_ip: str | None
    cree_le: datetime