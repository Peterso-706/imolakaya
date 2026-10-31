from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.core.deps import CurrentUser, DbSession, require_permissions
from app.core.permissions import Permissions
from app.core.exceptions import BadRequestError
from app.integrations.storage import upload_fichier
from app.models.enums import TypeMedia
from app.schemas.media import MediaCreate, MediaRead
from app.services import media_service

router = APIRouter()


@router.post(
    "/biens/{bien_id}/medias/upload",
    response_model=MediaRead,
    dependencies=[Depends(require_permissions(Permissions.MEDIA_AJOUTER))],
)
async def upload_media(
    bien_id: UUID,
    user: CurrentUser,
    db: DbSession,
    fichier: UploadFile = File(...),
    est_couverture: bool = Form(False),
):
    if not fichier.content_type:
        raise BadRequestError("Content-Type manquant")

    taille_estimee = 0
    contenu = await fichier.read()
    taille_estimee = len(contenu)
    media_service.valider_fichier(fichier.content_type, taille_estimee)

    result = upload_fichier(
        contenu,
        filename=fichier.filename or "fichier",
        content_type=fichier.content_type,
        dossier=f"biens/{bien_id}",
    )

    type_media = (
        TypeMedia.VIDEO if fichier.content_type.startswith("video/")
        else TypeMedia.PHOTO
    )

    payload = MediaCreate(
        url=result.url,
        public_id=result.public_id,
        type=type_media,
        est_couverture=est_couverture,
    )
    return media_service.ajouter_media(db, user, bien_id, payload)