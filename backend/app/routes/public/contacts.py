from fastapi import APIRouter, Depends, status

from app.core.deps import DbSession, OptionalUser
from app.core.rate_limit import rate_limit
from app.schemas.common import IdResponse
from app.schemas.interaction import ContactCreatePublic
from app.services import interaction_service

router = APIRouter()


@router.post(
    "/contacts",
    response_model=IdResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit("public.contact", 5))],
)
def creer_contact(
    payload: ContactCreatePublic, user: OptionalUser, db: DbSession
):
    contact = interaction_service.creer_contact(db, payload, user=user)
    return {"id": contact.id}