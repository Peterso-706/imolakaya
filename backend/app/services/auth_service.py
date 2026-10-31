from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import BadRequestError, ConflictError, UnauthorizedError
from app.core.permissions import ROLE_PERMISSIONS, Roles
from app.core.security import create_access_token, hash_password, verify_password
from app.models.agence import Proprietaire
from app.models.role import Role
from app.models.utilisateur import Utilisateur
from app.schemas.auth import RegisterProprietaireRequest, TokenResponse


def _charger_role(db: Session, nom: str) -> Role:
    role = db.scalar(select(Role).where(Role.nom == nom))
    if role is None:
        role = Role(nom=nom, description=f"Rôle {nom}")
        db.add(role)
        db.flush()
    return role


def enregistrer_proprietaire(
    db: Session, payload: RegisterProprietaireRequest
) -> Utilisateur:
    existant = db.scalar(select(Utilisateur).where(Utilisateur.email == payload.email))
    if existant is not None:
        raise ConflictError("Un compte existe déjà avec cet email")

    user = Utilisateur(
        email=payload.email,
        mot_de_passe_hash=hash_password(payload.mot_de_passe),
        nom=payload.nom,
        prenom=payload.prenom,
        telephone=payload.telephone,
        est_actif=True,
    )
    role_proprietaire = _charger_role(db, Roles.PROPRIETAIRE)
    user.roles.append(role_proprietaire)

    db.add(user)
    db.flush()
    db.add(Proprietaire(utilisateur_id=user.id))
    db.commit()
    db.refresh(user)
    return user


def authentifier(db: Session, email: str, mot_de_passe: str) -> TokenResponse:
    user = db.scalar(select(Utilisateur).where(Utilisateur.email == email))
    if user is None or not user.est_actif:
        raise UnauthorizedError("Identifiants invalides")
    if not verify_password(mot_de_passe, user.mot_de_passe_hash):
        raise UnauthorizedError("Identifiants invalides")

    roles = [r.nom for r in user.roles]
    perms: set[str] = set()
    for r in user.roles:
        perms.update(ROLE_PERMISSIONS.get(r.nom, []))
    token, expire = create_access_token(
        str(user.id), roles=roles, permissions=sorted(perms)
    )
    return TokenResponse(access_token=token, expire_dans=expire)


def changer_mot_de_passe(
    db: Session, user: Utilisateur, ancien: str, nouveau: str
) -> None:
    if not verify_password(ancien, user.mot_de_passe_hash):
        raise BadRequestError("Ancien mot de passe incorrect")
    user.mot_de_passe_hash = hash_password(nouveau)
    db.commit()