from sqlalchemy import select

from fastapi import APIRouter

from app.core.deps import DbSession
from app.models.bien import Categorie, Localisation
from app.schemas.bien import CategorieRead, LocalisationRead

router = APIRouter()


@router.get("/categories", response_model=list[CategorieRead])
def lister_categories(db: DbSession):
    return db.scalars(
        select(Categorie).where(Categorie.est_active.is_(True)).order_by(Categorie.ordre)
    ).all()


@router.get("/localisations", response_model=list[LocalisationRead])
def lister_localisations(db: DbSession, departement: str | None = None):
    stmt = select(Localisation)
    if departement:
        stmt = stmt.where(Localisation.departement == departement)
    return db.scalars(stmt.order_by(Localisation.departement, Localisation.commune)).all()