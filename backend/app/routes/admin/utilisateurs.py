from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Depends, Query

from app.core.deps import CurrentUser, DbSession, require_permissions
from app.core.permissions import Permissions
from app.schemas.utilisateur import UtilisateurAdminUpdate, UtilisateurCreate, UtilisateurRead, UtilisateurReadDetail
from app.services import utilisateur_service
from app.core.exceptions import NotFoundError
from app.models.utilisateur import Utilisateur

router = APIRouter()


@router.get("/utilisateurs")
def lister(
    db: DbSession,
    user: Annotated[Any, Depends(require_permissions(Permissions.UTILISATEUR_LIRE))],
    page: Annotated[int, Query(ge=1)] = 1,
    taille: Annotated[int, Query(ge=1, le=100)] = 20,
) -> dict[str, Any]:
    items, total = utilisateur_service.lister_utilisateurs(db, page=page, taille=taille)
    return {
        "items": items, "total": total, "page": page, "taille": taille,
        "pages": (total + taille - 1) // taille if total else 0,
    }


@router.post(
    "/utilisateurs",
    response_model=UtilisateurRead,
    dependencies=[Depends(require_permissions(Permissions.UTILISATEUR_CREER))],
)
def creer(
    payload: UtilisateurCreate, user: CurrentUser, db: DbSession,
    roles: list[str] | None = None,
):
    return utilisateur_service.creer_utilisateur_admin(
        db, user, payload, role_noms=roles or []
    )


@router.patch(
    "/utilisateurs/{user_id}",
    response_model=UtilisateurRead,
    dependencies=[Depends(require_permissions(Permissions.UTILISATEUR_MODIFIER))],
)
def modifier(
    user_id: UUID, payload: UtilisateurAdminUpdate, user: CurrentUser, db: DbSession
):
    return utilisateur_service.modifier_utilisateur(db, user, user_id, payload)


@router.get("/utilisateurs/{user_id}", response_model=UtilisateurReadDetail)
def detail_utilisateur(
    user_id: UUID,
    db: DbSession,
    user: Annotated[Any, Depends(require_permissions(Permissions.UTILISATEUR_LIRE))],
):
    u = db.get(Utilisateur, user_id)
    if not u:
        raise NotFoundError("Utilisateur introuvable")
    return u


@router.get("/proprietaires")
def lister_proprietaires(
    db: DbSession,
    user: Annotated[Any, Depends(require_permissions(Permissions.UTILISATEUR_LIRE))],
    page: Annotated[int, Query(ge=1)] = 1,
    taille: Annotated[int, Query(ge=1, le=100)] = 20,
):
    # Requête SQLAlchemy qui joint utilisateur + roles et filtre sur le rôle "proprietaire"
    from app.models.role import Role
    from sqlalchemy import func, select
    from app.models.utilisateur import Utilisateur
    
    stmt = (
        select(Utilisateur)
        .join(Utilisateur.roles)
        .where(Role.nom == "proprietaire")
        .order_by(Utilisateur.cree_le.desc())
    )
    total = db.scalar(
        select(func.count())
        .select_from(Utilisateur)
        .join(Utilisateur.roles)
        .where(Role.nom == "proprietaire")
    ) or 0
    items = db.scalars(stmt.offset((page - 1) * taille).limit(taille)).all()
    return {
        "items": items, "total": total, "page": page, "taille": taille,
        "pages": (total + taille - 1) // taille if total else 0,
    }