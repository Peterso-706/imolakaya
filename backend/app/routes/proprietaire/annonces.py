from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Depends, Query

from app.core.deps import CurrentUser, DbSession, require_permissions
from app.core.permissions import Permissions
from app.schemas.annonce import AnnonceCreate, AnnonceRead, AnnonceUpdate
from app.services import annonce_service

router = APIRouter()


@router.get("/annonces")
def lister(
    db: DbSession, user: CurrentUser,
    page: Annotated[int, Query(ge=1)] = 1,
    taille: Annotated[int, Query(ge=1, le=100)] = 20,
) -> dict[str, Any]:
    items, total = annonce_service.lister_annonces_proprietaire(db, user, page=page, taille=taille)
    return {
        "items": items, "total": total, "page": page, "taille": taille,
        "pages": (total + taille - 1) // taille if total else 0,
    }


@router.post(
    "/annonces",
    response_model=AnnonceRead,
    dependencies=[Depends(require_permissions(Permissions.ANNONCE_CREER))],
)
def creer(payload: AnnonceCreate, user: CurrentUser, db: DbSession):
    return annonce_service.creer_annonce(db, user, payload)


@router.patch(
    "/annonces/{annonce_id}",
    response_model=AnnonceRead,
    dependencies=[Depends(require_permissions(Permissions.ANNONCE_CREER))],
)
def modifier(annonce_id: UUID, payload: AnnonceUpdate, user: CurrentUser, db: DbSession):
    return annonce_service.modifier_annonce(db, user, annonce_id, payload)


@router.post(
    "/annonces/{annonce_id}/soumettre",
    response_model=AnnonceRead,
    dependencies=[Depends(require_permissions(Permissions.ANNONCE_SOUMETTRE))],
)
def soumettre(annonce_id: UUID, user: CurrentUser, db: DbSession):
    return annonce_service.soumettre_annonce(db, user, annonce_id)