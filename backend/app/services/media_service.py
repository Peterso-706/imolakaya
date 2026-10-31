from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import BadRequestError, ForbiddenError, NotFoundError
from app.models.bien import Bien
from app.models.media import Media
from app.models.utilisateur import Utilisateur
from app.schemas.media import MediaCreate, MediaReorderRequest
from app.services.audit_service import log_action
from app.services.bien_service import _assert_proprietaire

MIME_PHOTOS = {"image/jpeg", "image/png", "image/webp"}
MIME_VIDEOS = {"video/mp4", "video/webm"}
TAILLE_MAX_PHOTO = 5 * 1024 * 1024   # 5 Mo
TAILLE_MAX_VIDEO = 50 * 1024 * 1024  # 50 Mo


def valider_fichier(mime: str, taille: int) -> None:
    """SEL-PRO-06 — type et taille."""
    if mime in MIME_PHOTOS:
        if taille > TAILLE_MAX_PHOTO:
            raise BadRequestError("Photo trop volumineuse (max 5 Mo)")
    elif mime in MIME_VIDEOS:
        if taille > TAILLE_MAX_VIDEO:
            raise BadRequestError("Vidéo trop volumineuse (max 50 Mo)")
    else:
        raise BadRequestError("Type de fichier non autorisé")


def ajouter_media(
    db: Session, user: Utilisateur, bien_id: UUID, payload: MediaCreate
) -> Media:
    bien = db.get(Bien, bien_id)
    if bien is None:
        raise NotFoundError("Bien introuvable")
    _assert_proprietaire(user, bien)

    if payload.est_couverture:
        # désélectionner l'ancienne couverture
        db.execute(
            select(Media).where(Media.bien_id == bien.id, Media.est_couverture.is_(True))
        )
        for m in bien.medias:
            if m.est_couverture:
                m.est_couverture = False

    media = Media(bien_id=bien.id, **payload.model_dump())
    db.add(media)
    db.flush()
    log_action(db, user_id=user.id, action="media.ajout",
               entite="Media", entite_id=media.id)
    db.commit()
    db.refresh(media)
    return media


def reordonner_medias(
    db: Session, user: Utilisateur, bien_id: UUID, payload: MediaReorderRequest
) -> None:
    bien = db.get(Bien, bien_id)
    if bien is None:
        raise NotFoundError("Bien introuvable")
    _assert_proprietaire(user, bien)

    ids_autorises = {m.id for m in bien.medias}
    for item in payload.items:
        if item.id not in ids_autorises:
            raise ForbiddenError(f"Média {item.id} hors périmètre")
    for item in payload.items:
        media = db.get(Media, item.id)
        media.ordre = item.ordre
    db.commit()


def supprimer_media(db: Session, user: Utilisateur, media_id: UUID) -> None:
    media = db.get(Media, media_id)
    if media is None:
        raise NotFoundError("Média introuvable")
    _assert_proprietaire(user, media.bien)

    # suppression côté stockage externe (Cloudinary/R2) — voir integrations/storage
    from app.integrations.storage import supprimer_fichier
    if media.public_id:
        supprimer_fichier(media.public_id)

    db.delete(media)
    db.commit()