from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Depends, Query

from app.core.deps import CurrentUser, DbSession, require_permissions
from app.core.permissions import Permissions
from app.schemas.annonce import (
    AnnonceApprouverRequest,
    AnnonceRead,
    AnnonceRejeterRequest,
)
from app.services import annonce_service

router = APIRouter()


@router.get("/annonces")
def lister(
    db: DbSession, user: CurrentUser,
    page: Annotated[int, Query(ge=1)] = 1,
    taille: Annotated[int, Query(ge=1, le=100)] = 20,
) -> dict[str, Any]:
    items, total = annonce_service.lister_annonces_admin(db, page=page, taille=taille)
    return {
        "items": items, "total": total, "page": page, "taille": taille,
        "pages": (total + taille - 1) // taille if total else 0,
    }


@router.post(
    "/annonces/{annonce_id}/approuver",
    response_model=AnnonceRead,
    dependencies=[Depends(require_permissions(Permissions.ANNONCE_APPROUVER))],
)
def approuver(
    annonce_id: UUID, payload: AnnonceApprouverRequest,
    user: CurrentUser, db: DbSession,
):
    return annonce_service.approuver_annonce(
        db, user, annonce_id, date_expiration=payload.date_expiration
    )


@router.post(
    "/annonces/{annonce_id}/rejeter",
    response_model=AnnonceRead,
    dependencies=[Depends(require_permissions(Permissions.ANNONCE_REJETER))],
)
def rejeter(
    annonce_id: UUID, payload: AnnonceRejeterRequest,
    user: CurrentUser, db: DbSession,
):
    return annonce_service.rejeter_annonce(db, user, annonce_id, payload)


@router.post(
    "/annonces/{annonce_id}/publier",
    response_model=AnnonceRead,
    dependencies=[Depends(require_permissions(Permissions.ANNONCE_APPROUVER))],
)
def publier(annonce_id: UUID, user: CurrentUser, db: DbSession):
    return annonce_service.publier_annonce(db, user, annonce_id)