from typing import Annotated, Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select

from app.core.deps import CurrentUser, DbSession, require_permissions
from app.core.permissions import Permissions
from app.models.audit import AuditLog

router = APIRouter()


@router.get(
    "/audit",
    dependencies=[Depends(require_permissions(Permissions.AUDIT_LIRE))],
)
def lister_audit(
    db: DbSession, user: CurrentUser,
    page: Annotated[int, Query(ge=1)] = 1,
    taille: Annotated[int, Query(ge=1, le=100)] = 20,
) -> dict[str, Any]:
    stmt = select(AuditLog).order_by(AuditLog.cree_le.desc())
    total = db.scalar(select(func.count()).select_from(AuditLog)) or 0
    items = db.scalars(stmt.offset((page - 1) * taille).limit(taille)).all()
    return {
        "items": items, "total": total, "page": page, "taille": taille,
        "pages": (total + taille - 1) // taille if total else 0,
    }