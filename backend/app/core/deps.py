from typing import Annotated
from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.exceptions import ForbiddenError, UnauthorizedError
from app.core.security import decode_access_token
from app.database.session import get_db
from app.models.utilisateur import Utilisateur


_bearer = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    db: Annotated[Session, Depends(get_db)],
) -> Utilisateur:
    if credentials is None:
        raise UnauthorizedError("Authentification requise")
    payload = decode_access_token(credentials.credentials)
    try:
        user_id = UUID(payload["sub"])
    except (KeyError, ValueError):
        raise UnauthorizedError("Jeton invalide")
    user = db.get(Utilisateur, user_id)
    if user is None or not user.est_actif:
        raise UnauthorizedError("Compte inactif ou inexistant")
    return user


def get_current_user_optional(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    db: Annotated[Session, Depends(get_db)],
) -> Utilisateur | None:
    if credentials is None:
        return None
    try:
        payload = decode_access_token(credentials.credentials)
        user_id = UUID(payload["sub"])
        user = db.get(Utilisateur, user_id)
        return user if user and user.est_actif else None
    except Exception:
        return None


def _user_roles(user: Utilisateur) -> set[str]:
    return {r.nom for r in user.roles}


def _user_permissions(user: Utilisateur) -> set[str]:
    perms: set[str] = set()
    for role in user.roles:
        if role.nom == "admin_principal":
            return {"*"}
        for perm in role.permissions:
            perms.add(perm.code)
    return perms


def require_roles(*roles: str):
    def _dep(user: Annotated[Utilisateur, Depends(get_current_user)]) -> Utilisateur:
        if not _user_roles(user).intersection(roles):
            raise ForbiddenError("Rôle insuffisant")
        return user
    return _dep


def require_permissions(*required: str):
    def _dep(user: Annotated[Utilisateur, Depends(get_current_user)]) -> Utilisateur:
        perms = _user_permissions(user)
        if "*" in perms:
            return user
        if not set(required).issubset(perms):
            raise ForbiddenError("Permission insuffisante")
        return user
    return _dep


# Alias typés (à utiliser dans les routes)
CurrentUser = Annotated[Utilisateur, Depends(get_current_user)]
OptionalUser = Annotated[Utilisateur | None, Depends(get_current_user_optional)]
DbSession = Annotated[Session, Depends(get_db)]