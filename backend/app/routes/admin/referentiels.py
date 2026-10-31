from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy import select

from app.core.deps import CurrentUser, DbSession, require_permissions
from app.core.permissions import Permissions
from app.models.bien import Categorie, Localisation
from app.schemas.bien import (
    CategorieCreate,
    CategorieRead,
    CategorieUpdate,
    LocalisationCreate,
    LocalisationRead,
)

router = APIRouter()


@router.post(
    "/categories",
    response_model=CategorieRead,
    dependencies=[Depends(require_permissions(Permissions.PARAMETRE_GERER))],
)
def creer_categorie(payload: CategorieCreate, db: DbSession):
    cat = Categorie(**payload.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.patch(
    "/categories/{cat_id}",
    response_model=CategorieRead,
    dependencies=[Depends(require_permissions(Permissions.PARAMETRE_GERER))],
)
def modifier_categorie(cat_id: UUID, payload: CategorieUpdate, db: DbSession):
    cat = db.get(Categorie, cat_id)
    if cat:
        for k, v in payload.model_dump(exclude_unset=True).items():
            setattr(cat, k, v)
        db.commit()
        db.refresh(cat)
    return cat


@router.get("/localisations", response_model=list[LocalisationRead])
def lister_localisations(db: DbSession, user: CurrentUser):
    return db.scalars(select(Localisation)).all()


@router.post(
    "/localisations",
    response_model=LocalisationRead,
    dependencies=[Depends(require_permissions(Permissions.PARAMETRE_GERER))],
)
def creer_localisation(payload: LocalisationCreate, db: DbSession):
    loc = Localisation(**payload.model_dump())
    db.add(loc)
    db.commit()
    db.refresh(loc)
    return loc