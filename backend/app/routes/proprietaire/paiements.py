from typing import Annotated, Any

from fastapi import APIRouter, Depends, Query

from app.core.deps import CurrentUser, DbSession, require_permissions
from app.core.permissions import Permissions
from app.schemas.paiement import PaiementCreateEnLigne, PaiementRead
from app.services import paiement_service

router = APIRouter()


@router.get("/paiements")
def lister(
    db: DbSession, user: CurrentUser,
    page: Annotated[int, Query(ge=1)] = 1,
    taille: Annotated[int, Query(ge=1, le=100)] = 20,
) -> dict[str, Any]:
    items, total = paiement_service.lister_paiements_proprietaire(db, user, page=page, taille=taille)
    return {
        "items": items, "total": total, "page": page, "taille": taille,
        "pages": (total + taille - 1) // taille if total else 0,
    }


@router.post(
    "/paiements",
    response_model=PaiementRead,
    dependencies=[Depends(require_permissions(Permissions.PAIEMENT_CREER))],
)
def creer(payload: PaiementCreateEnLigne, user: CurrentUser, db: DbSession):
    return paiement_service.creer_paiement_en_ligne(db, user, payload)