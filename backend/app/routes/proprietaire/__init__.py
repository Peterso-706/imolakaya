from fastapi import APIRouter

from . import (
    annonces, biens, contacts, favoris, medias, notifications, paiements, upload,
)

router = APIRouter()
router.include_router(biens.router, tags=["proprietaire.biens"])
router.include_router(medias.router, tags=["proprietaire.medias"])
router.include_router(upload.router, tags=["proprietaire.upload"])
router.include_router(annonces.router, tags=["proprietaire.annonces"])
router.include_router(paiements.router, tags=["proprietaire.paiements"])
router.include_router(contacts.router, tags=["proprietaire.contacts"])
router.include_router(notifications.router, tags=["proprietaire.notifications"])
router.include_router(favoris.router, tags=["proprietaire.favoris"])