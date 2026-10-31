from uuid import UUID

from fastapi import APIRouter, Depends

from app.core.deps import CurrentUser, DbSession, require_permissions
from app.core.permissions import Permissions
from app.schemas.common import MessageResponse
from app.schemas.media import MediaCreate, MediaRead, MediaReorderRequest
from app.services import media_service

router = APIRouter()


@router.post(
    "/biens/{bien_id}/medias",
    response_model=MediaRead,
    dependencies=[Depends(require_permissions(Permissions.MEDIA_AJOUTER))],
)
def ajouter_media(
    bien_id: UUID, payload: MediaCreate, user: CurrentUser, db: DbSession
):
    return media_service.ajouter_media(db, user, bien_id, payload)


@router.patch(
    "/biens/{bien_id}/medias/reordonner",
    response_model=MessageResponse,
    dependencies=[Depends(require_permissions(Permissions.MEDIA_AJOUTER))],
)
def reordonner(
    bien_id: UUID, payload: MediaReorderRequest, user: CurrentUser, db: DbSession
):
    media_service.reordonner_medias(db, user, bien_id, payload)
    return {"message": "Ordre mis à jour"}


@router.delete(
    "/medias/{media_id}",
    response_model=MessageResponse,
    dependencies=[Depends(require_permissions(Permissions.MEDIA_SUPPRIMER))],
)
def supprimer_media(media_id: UUID, user: CurrentUser, db: DbSession):
    media_service.supprimer_media(db, user, media_id)
    return {"message": "Média supprimé"}