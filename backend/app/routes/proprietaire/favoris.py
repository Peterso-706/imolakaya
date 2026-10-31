from uuid import UUID

from fastapi import APIRouter

from app.core.deps import CurrentUser, DbSession
from app.schemas.common import IdResponse, MessageResponse
from app.schemas.interaction import FavoriCreate, FavoriRead
from app.services import interaction_service

router = APIRouter()


@router.get("/favoris", response_model=list[FavoriRead])
def lister(user: CurrentUser, db: DbSession):
    return interaction_service.lister_favoris(db, user)


@router.post("/favoris", response_model=IdResponse)
def ajouter(payload: FavoriCreate, user: CurrentUser, db: DbSession):
    fav = interaction_service.ajouter_favori(db, user, payload.bien_id)
    return {"id": fav.id}


@router.delete("/favoris/{bien_id}", response_model=MessageResponse)
def retirer(bien_id: UUID, user: CurrentUser, db: DbSession):
    interaction_service.retirer_favori(db, user, bien_id)
    return {"message": "Retiré des favoris"}