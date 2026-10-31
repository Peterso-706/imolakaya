from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Query

from app.core.deps import CurrentUser, DbSession
from app.schemas.interaction import NotificationRead
from app.services import interaction_service

router = APIRouter()


@router.get("/notifications")
def lister(
    db: DbSession, user: CurrentUser,
    page: Annotated[int, Query(ge=1)] = 1,
    taille: Annotated[int, Query(ge=1, le=100)] = 20,
) -> dict[str, Any]:
    items, total = interaction_service.lister_notifications(db, user, page=page, taille=taille)
    return {
        "items": items, "total": total, "page": page, "taille": taille,
        "pages": (total + taille - 1) // taille if total else 0,
    }


@router.post("/notifications/{notif_id}/lue", response_model=NotificationRead)
def marquer_lue(notif_id: UUID, user: CurrentUser, db: DbSession):
    return interaction_service.marquer_notification_lue(db, user, notif_id)