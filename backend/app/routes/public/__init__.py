# app/routes/public/__init__.py
from fastapi import APIRouter

import app.routes.public.avis as avis
import app.routes.public.biens as biens
import app.routes.public.contacts as contacts
import app.routes.public.referentiels as referentiels
import app.routes.public.visites as visites
import app.routes.public.webhooks as webhooks

router = APIRouter()
router.include_router(biens.router, tags=["public.biens"])
router.include_router(contacts.router, tags=["public.contacts"])
router.include_router(visites.router, tags=["public.visites"])
router.include_router(avis.router, tags=["public.avis"])
router.include_router(referentiels.router, tags=["public.referentiels"])
router.include_router(webhooks.router, tags=["public.webhooks"])