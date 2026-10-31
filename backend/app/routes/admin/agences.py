from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy import select

from app.core.deps import CurrentUser, DbSession, require_permissions
from app.core.permissions import Permissions
from app.models.agence import Agence, Employe
from app.schemas.agence import (
    AgenceCreate,
    AgenceRead,
    AgenceUpdate,
    EmployeCreate,
    EmployeRead,
    EmployeUpdate,
)

router = APIRouter()


@router.get("/agences", response_model=list[AgenceRead])
def lister_agences(db: DbSession, user: CurrentUser):
    return db.scalars(select(Agence)).all()


@router.post(
    "/agences",
    response_model=AgenceRead,
    dependencies=[Depends(require_permissions(Permissions.AGENCE_GERER))],
)
def creer_agence(payload: AgenceCreate, db: DbSession):
    ag = Agence(**payload.model_dump())
    db.add(ag)
    db.commit()
    db.refresh(ag)
    return ag


@router.patch(
    "/agences/{agence_id}",
    response_model=AgenceRead,
    dependencies=[Depends(require_permissions(Permissions.AGENCE_GERER))],
)
def modifier_agence(agence_id: UUID, payload: AgenceUpdate, db: DbSession):
    ag = db.get(Agence, agence_id)
    if ag:
        for k, v in payload.model_dump(exclude_unset=True).items():
            setattr(ag, k, v)
        db.commit()
        db.refresh(ag)
    return ag


@router.get("/employes", response_model=list[EmployeRead])
def lister_employes(db: DbSession, user: CurrentUser):
    return db.scalars(select(Employe)).all()


@router.post(
    "/employes",
    response_model=EmployeRead,
    dependencies=[Depends(require_permissions(Permissions.EMPLOYE_GERER))],
)
def creer_employe(payload: EmployeCreate, db: DbSession):
    emp = Employe(**payload.model_dump())
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp


@router.patch(
    "/employes/{employe_id}",
    response_model=EmployeRead,
    dependencies=[Depends(require_permissions(Permissions.EMPLOYE_GERER))],
)
def modifier_employe(employe_id: UUID, payload: EmployeUpdate, db: DbSession):
    emp = db.get(Employe, employe_id)
    if emp:
        for k, v in payload.model_dump(exclude_unset=True).items():
            setattr(emp, k, v)
        db.commit()
        db.refresh(emp)
    return emp