from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Query

from app.core.deps import CurrentUser, DbSession
from app.schemas.interaction import ContactRead, ContactUpdateProprietaire
from app.services import interaction_service

router = APIRouter()


@router.get("/contacts")
def lister(
    db: DbSession, user: CurrentUser,
    page: Annotated[int, Query(ge=1)] = 1,
    taille: Annotated[int, Query(ge=1, le=100)] = 20,
) -> dict[str, Any]:
    items, total = interaction_service.lister_contacts_proprietaire(db, user, page=page, taille=taille)
    return {
        "items": items, "total": total, "page": page, "taille": taille,
        "pages": (total + taille - 1) // taille if total else 0,
    }