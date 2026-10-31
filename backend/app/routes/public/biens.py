from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Query

from app.core.deps import DbSession
from app.schemas.bien import BienReadDetail, BienSearchParams
from app.schemas.common import PaginatedResponse
from app.schemas.interaction import VisiteStats
from app.services import bien_service, interaction_service

router = APIRouter()


@router.get("/biens", response_model=PaginatedResponse[BienReadDetail])
def rechercher(
    db: DbSession,
    q: str | None = None,
    type_operation: str | None = None,
    type_location: str | None = None,
    categorie_id: UUID | None = None,
    departement: str | None = None,
    commune: str | None = None,
    zone: str | None = None,
    prix_min: float | None = None,
    prix_max: float | None = None,
    page: Annotated[int, Query(ge=1)] = 1,
    taille: Annotated[int, Query(ge=1, le=100)] = 20,
):
    params = BienSearchParams(
        q=q,
        type_operation=type_operation,
        type_location=type_location,
        categorie_id=categorie_id,
        departement=departement,
        commune=commune,
        zone=zone,
        prix_min=prix_min,
        prix_max=prix_max,
        page=page,
        taille=taille,
    )
    items, total = bien_service.rechercher_biens(db, params)
    return {
        "items": items,
        "total": total,
        "page": page,
        "taille": taille,
        "pages": (total + taille - 1) // taille if total else 0,
    }


@router.get("/biens/{bien_id}", response_model=BienReadDetail)
def detail(bien_id: UUID, db: DbSession):
    return bien_service._charge_bien_ou_404(db, bien_id)


@router.get("/biens/{bien_id}/statistiques", response_model=VisiteStats)
def statistiques(bien_id: UUID, db: DbSession):
    return interaction_service.stats_visites(db, bien_id)