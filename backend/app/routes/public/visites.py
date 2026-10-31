from fastapi import APIRouter, Request, status

from app.core.deps import DbSession, OptionalUser
from app.schemas.common import IdResponse
from app.schemas.interaction import VisiteCreate
from app.services import interaction_service

router = APIRouter()


@router.post(
    "/visites",
    response_model=IdResponse | None,
    status_code=status.HTTP_201_CREATED,
)
def enregistrer_visite(
    payload: VisiteCreate, user: OptionalUser, db: DbSession, request: Request
):
    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent")
    visite = interaction_service.enregistrer_visite(
        db, payload, user=user, adresse_ip=ip, user_agent=ua
    )
    return {"id": visite.id} if visite else None