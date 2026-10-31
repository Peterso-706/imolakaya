from fastapi import APIRouter, Depends
from sqlalchemy import func, select

from app.core.deps import CurrentUser, DbSession, require_permissions
from app.core.permissions import Permissions
from app.models.annonce import Annonce
from app.models.bien import Bien
from app.models.interaction import Contact, Visite
from app.models.paiement import Paiement

router = APIRouter()


@router.get(
    "/rapports/tableau-de-bord",
    dependencies=[Depends(require_permissions(Permissions.RAPPORT_LIRE))],
)
def tableau_de_bord(db: DbSession, user: CurrentUser):
    return {
        "biens_total": db.scalar(select(func.count()).select_from(Bien)) or 0,
        "annonces_total": db.scalar(select(func.count()).select_from(Annonce)) or 0,
        "paiements_total": db.scalar(select(func.count()).select_from(Paiement)) or 0,
        "visites_total": db.scalar(select(func.count()).select_from(Visite)) or 0,
        "contacts_total": db.scalar(select(func.count()).select_from(Contact)) or 0,
    }