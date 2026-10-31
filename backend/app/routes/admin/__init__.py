from fastapi import APIRouter

from . import (
    agences, annonces, audit, biens, paiements, rapports, referentiels, utilisateurs,
)

router = APIRouter()
router.include_router(utilisateurs.router, tags=["admin.utilisateurs"])
router.include_router(biens.router, tags=["admin.biens"])
router.include_router(annonces.router, tags=["admin.annonces"])
router.include_router(paiements.router, tags=["admin.paiements"])
router.include_router(referentiels.router, tags=["admin.referentiels"])
router.include_router(agences.router, tags=["admin.agences"])
router.include_router(rapports.router, tags=["admin.rapports"])
router.include_router(audit.router, tags=["admin.audit"])