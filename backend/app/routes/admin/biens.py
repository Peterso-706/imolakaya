from typing import Annotated, Any

from fastapi import APIRouter, Query

from app.core.deps import CurrentUser, DbSession, require_permissions
from app.core.permissions import Permissions
from app.services import bien_service

router = APIRouter()


@router.get("/biens")
def lister(
    db: DbSession,
    user: Annotated[Any, None] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    taille: Annotated[int, Query(ge=1, le=100)] = 20,
) -> dict[str, Any]:
    items, total = bien_service.lister_biens_admin(db, page=page, taille=taille)
    return {
        "items": items, "total": total, "page": page, "taille": taille,
        "pages": (total + taille - 1) // taille if total else 0,
    }