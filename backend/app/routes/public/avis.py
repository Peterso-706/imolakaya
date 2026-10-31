from fastapi import APIRouter, Depends, status

from app.core.deps import DbSession, OptionalUser
from app.core.rate_limit import rate_limit
from app.schemas.common import IdResponse
from app.schemas.interaction import AvisCreate
from app.services import interaction_service

router = APIRouter()


@router.post(
    "/avis",
    response_model=IdResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit("public.avis", 3))],
)
def creer_avis(payload: AvisCreate, user: OptionalUser, db: DbSession):
    avis = interaction_service.creer_avis(db, payload, user=user)
    return {"id": avis.id}