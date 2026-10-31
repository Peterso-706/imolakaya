from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, NotFoundError
from app.core.security import hash_password
from app.models.role import Role
from app.models.utilisateur import Utilisateur
from app.schemas.utilisateur import (
    UtilisateurAdminUpdate,
    UtilisateurCreate,
)
from app.services.audit_service import log_action


def creer_utilisateur_admin(
    db: Session, admin: Utilisateur, payload: UtilisateurCreate,
    *, role_noms: list[str],
) -> Utilisateur:
    if db.scalar(select(Utilisateur).where(Utilisateur.email == payload.email)):
        raise ConflictError("Email déjà utilisé")
    user = Utilisateur(
        email=payload.email,
        mot_de_passe_hash=hash_password(payload.mot_de_passe),
        nom=payload.nom, prenom=payload.prenom, telephone=payload.telephone,
    )
    roles = db.scalars(select(Role).where(Role.nom.in_(role_noms))).all()
    user.roles.extend(roles)
    db.add(user)
    db.flush()
    log_action(db, user_id=admin.id, action="utilisateur.creation",
               entite="Utilisateur", entite_id=user.id,
               details={"roles": role_noms})
    db.commit()
    db.refresh(user)
    return user


def modifier_utilisateur(
    db: Session, admin: Utilisateur, user_id: UUID, payload: UtilisateurAdminUpdate
) -> Utilisateur:
    user = db.get(Utilisateur, user_id)
    if user is None:
        raise NotFoundError("Utilisateur introuvable")
    for champ, valeur in payload.model_dump(exclude_unset=True).items():
        setattr(user, champ, valeur)
    log_action(db, user_id=admin.id, action="utilisateur.modification",
               entite="Utilisateur", entite_id=user.id)
    db.commit()
    db.refresh(user)
    return user


def lister_utilisateurs(
    db: Session, *, page: int = 1, taille: int = 20
) -> tuple[list[Utilisateur], int]:
    total = db.scalar(select(func.count()).select_from(Utilisateur)) or 0
    items = db.scalars(
        select(Utilisateur).order_by(Utilisateur.cree_le.desc())
        .offset((page - 1) * taille).limit(taille)
    ).all()
    return list(items), total