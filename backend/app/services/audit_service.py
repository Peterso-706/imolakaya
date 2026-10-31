from uuid import UUID

from sqlalchemy.orm import Session

from app.models.audit import AuditLog


def log_action(
    db: Session,
    *,
    user_id: UUID | None,
    action: str,
    entite: str,
    entite_id: UUID | None = None,
    details: dict | None = None,
    adresse_ip: str | None = None,
    user_agent: str | None = None,
) -> AuditLog:
    entry = AuditLog(
        utilisateur_id=user_id,
        action=action,
        entite=entite,
        entite_id=entite_id,
        details=details,
        adresse_ip=adresse_ip,
        user_agent=user_agent,
    )
    db.add(entry)
    db.flush()
    return entry