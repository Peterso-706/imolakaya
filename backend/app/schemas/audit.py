from datetime import datetime
from typing import Any
from uuid import UUID

from app.schemas.common import ORMModel


class AuditLogRead(ORMModel):
    id: UUID
    utilisateur_id: UUID | None
    action: str
    entite: str
    entite_id: UUID | None
    details: dict[str, Any] | None
    adresse_ip: str | None
    user_agent: str | None
    cree_le: datetime