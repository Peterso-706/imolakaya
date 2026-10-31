from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request

from app.core.deps import CurrentUser, DbSession
from app.core.permissions import Permissions
from app.core.deps import require_permissions
from app.schemas.bien import BienCreate, BienRead, BienUpdate
from app.schemas.common import MessageResponse
from app.services import bien_service

router = APIRouter()


@router.get("/biens")
def lister(
    db: DbSession,
    user: CurrentUser,
    page: Annotated[int, Query(ge=1)] = 1,
    taille: Annotated[int, Query(ge=1, le=100)] = 20,
) -> dict[str, Any]:
    items, total = bien_service.lister_biens_proprietaire(db, user, page=page, taille=taille)
    return {
        "items": items, "total": total, "page": page, "taille": taille,
        "pages": (total + taille - 1) // taille if total else 0,
    }


@router.post(
    "/biens",
    response_model=BienRead,
    dependencies=[Depends(require_permissions(Permissions.BIEN_CREER))],
)
def creer(
    payload: BienCreate, user: CurrentUser, db: DbSession, request: Request
):
    ip = request.client.host if request.client else None
    return bien_service.creer_bien(db, user, payload, ip=ip)


@router.get("/biens/{bien_id}", response_model=BienRead)
def detail(bien_id: UUID, user: CurrentUser, db: DbSession):
    bien = bien_service._charge_bien_ou_404(db, bien_id)
    bien_service._assert_proprietaire(user, bien)
    return bien


@router.patch(
    "/biens/{bien_id}",
    response_model=BienRead,
    dependencies=[Depends(require_permissions(Permissions.BIEN_MODIFIER))],
)
def modifier(
    bien_id: UUID, payload: BienUpdate, user: CurrentUser, db: DbSession,
    request: Request,
):
    ip = request.client.host if request.client else None
    return bien_service.modifier_bien(db, user, bien_id, payload, ip=ip)


@router.delete(
    "/biens/{bien_id}",
    response_model=MessageResponse,
    dependencies=[Depends(require_permissions(Permissions.BIEN_SUPPRIMER))],
)
def supprimer(bien_id: UUID, user: CurrentUser, db: DbSession, request: Request):
    ip = request.client.host if request.client else None
    bien_service.supprimer_bien(db, user, bien_id, ip=ip)
    return {"message": "Bien supprimé (logique)"}