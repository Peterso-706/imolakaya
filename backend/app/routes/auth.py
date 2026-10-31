from fastapi import APIRouter, Depends, status

from app.core.deps import CurrentUser, DbSession
from app.core.rate_limit import rate_limit
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    RegisterProprietaireRequest,
    TokenResponse,
)
from app.schemas.common import MessageResponse
from app.schemas.utilisateur import UtilisateurRead
from app.services import auth_service

router = APIRouter()


@router.post(
    "/login",
    response_model=TokenResponse,
    dependencies=[Depends(rate_limit("auth.login", 10))],
)
def login(payload: LoginRequest, db: DbSession):
    return auth_service.authentifier(db, payload.email, payload.mot_de_passe)


@router.post(
    "/inscription",
    response_model=UtilisateurRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit("auth.register", 5))],
)
def inscription(payload: RegisterProprietaireRequest, db: DbSession):
    user = auth_service.enregistrer_proprietaire(db, payload)
    return user


@router.post("/changer-mot-de-passe", response_model=MessageResponse)
def changer_mot_de_passe(
    payload: ChangePasswordRequest, user: CurrentUser, db: DbSession
):
    auth_service.changer_mot_de_passe(
        db, user, payload.ancien_mot_de_passe, payload.nouveau_mot_de_passe
    )
    return {"message": "Mot de passe modifié"}