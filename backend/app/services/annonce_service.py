from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, ForbiddenError, NotFoundError
from app.models.annonce import Annonce
from app.models.enums import StatutAnnonce, StatutPaiement
from app.models.paiement import Paiement
from app.models.utilisateur import Utilisateur
from app.schemas.annonce import AnnonceCreate, AnnonceRejeterRequest, AnnonceUpdate
from app.services.audit_service import log_action
from app.services.bien_service import _assert_proprietaire, _charge_bien_ou_404
from app.models.bien import Bien


def _charge_annonce(db: Session, annonce_id: UUID) -> Annonce:
    annonce = db.get(Annonce, annonce_id)
    if annonce is None:
        raise NotFoundError("Annonce introuvable")
    return annonce


def creer_annonce(db: Session, user: Utilisateur, payload: AnnonceCreate) -> Annonce:
    bien = _charge_bien_ou_404(db, payload.bien_id)
    _assert_proprietaire(user, bien)

    annonce = Annonce(
        bien_id=bien.id,
        titre=payload.titre,
        description=payload.description,
        statut=StatutAnnonce.BROUILLON,
    )
    db.add(annonce)
    db.flush()
    log_action(db, user_id=user.id, action="annonce.creation",
               entite="Annonce", entite_id=annonce.id)
    db.commit()
    db.refresh(annonce)
    return annonce


def modifier_annonce(
    db: Session, user: Utilisateur, annonce_id: UUID, payload: AnnonceUpdate
) -> Annonce:
    annonce = _charge_annonce(db, annonce_id)
    _assert_proprietaire(user, annonce.bien)

    if annonce.statut not in (StatutAnnonce.BROUILLON, StatutAnnonce.REJETEE):
        raise ConflictError("Annonce non modifiable dans son état actuel")

    for champ, valeur in payload.model_dump(exclude_unset=True).items():
        setattr(annonce, champ, valeur)

    if annonce.statut == StatutAnnonce.REJETEE:
        # repasse en brouillon lors d'une nouvelle tentative
        annonce.statut = StatutAnnonce.BROUILLON
        annonce.motif_rejet = None

    db.commit()
    db.refresh(annonce)
    return annonce


def soumettre_annonce(
    db: Session, user: Utilisateur, annonce_id: UUID
) -> Annonce:
    annonce = _charge_annonce(db, annonce_id)
    _assert_proprietaire(user, annonce.bien)

    if annonce.statut != StatutAnnonce.BROUILLON:
        raise ConflictError("Seule une annonce brouillon peut être soumise")

    if not annonce.bien.medias:
        raise ConflictError("Au moins un média est requis avant soumission")

    annonce.statut = StatutAnnonce.EN_ATTENTE
    annonce.date_soumission = datetime.now(timezone.utc)

    log_action(db, user_id=user.id, action="annonce.soumission",
               entite="Annonce", entite_id=annonce.id)
    db.commit()
    db.refresh(annonce)
    return annonce


def approuver_annonce(
    db: Session, admin: Utilisateur, annonce_id: UUID, *,
    date_expiration: datetime | None = None,
) -> Annonce:
    """Approbation admin — mais reste EN_ATTENTE de paiement pour publication."""
    annonce = _charge_annonce(db, annonce_id)
    if annonce.statut != StatutAnnonce.EN_ATTENTE:
        raise ConflictError("Seule une annonce en attente peut être approuvée")

    annonce.statut = StatutAnnonce.APPROUVEE
    annonce.date_validation = datetime.now(timezone.utc)
    annonce.valide_par_id = admin.id
    annonce.date_expiration = date_expiration

    log_action(db, user_id=admin.id, action="annonce.approbation",
               entite="Annonce", entite_id=annonce.id)
    db.commit()
    db.refresh(annonce)
    return annonce


def rejeter_annonce(
    db: Session, admin: Utilisateur, annonce_id: UUID, payload: AnnonceRejeterRequest
) -> Annonce:
    annonce = _charge_annonce(db, annonce_id)
    if annonce.statut not in (StatutAnnonce.EN_ATTENTE, StatutAnnonce.APPROUVEE):
        raise ConflictError("Annonce non rejetable dans son état actuel")

    annonce.statut = StatutAnnonce.REJETEE
    annonce.date_validation = datetime.now(timezone.utc)
    annonce.valide_par_id = admin.id
    annonce.motif_rejet = payload.motif

    log_action(db, user_id=admin.id, action="annonce.rejet",
               entite="Annonce", entite_id=annonce.id,
               details={"motif": payload.motif})
    db.commit()
    db.refresh(annonce)
    return annonce


def publier_annonce(db: Session, admin: Utilisateur, annonce_id: UUID) -> Annonce:
    """
    RG-03 — publication uniquement si :
      1) l'annonce est APPROUVEE (validation admin faite)
      2) au moins un paiement CONFIRME et vérifié serveur existe
    """
    annonce = _charge_annonce(db, annonce_id)

    if annonce.statut != StatutAnnonce.APPROUVEE:
        raise ConflictError("L'annonce doit être approuvée avant publication")

    paiement_confirme = db.scalar(
        select(Paiement).where(
            Paiement.annonce_id == annonce.id,
            Paiement.statut == StatutPaiement.CONFIRME,
            Paiement.verifie_par_webhook.is_(True),
        )
    )
    if paiement_confirme is None:
        raise ForbiddenError(
            "Aucun paiement confirmé par le serveur — publication refusée (RG-03/RG-04)"
        )

    annonce.statut = StatutAnnonce.PUBLIEE
    annonce.date_publication = datetime.now(timezone.utc)

    log_action(db, user_id=admin.id, action="annonce.publication",
               entite="Annonce", entite_id=annonce.id,
               details={"paiement_id": str(paiement_confirme.id)})
    db.commit()
    db.refresh(annonce)
    return annonce

def lister_annonces_admin(db: Session, *, page: int = 1, taille: int = 20):
    stmt = select(Annonce)
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    items = db.scalars(
        stmt.order_by(Annonce.cree_le.desc()).offset((page - 1) * taille).limit(taille)
    ).all()
    return list(items), total


def lister_annonces_proprietaire(db: Session, user: Utilisateur, *, page: int = 1, taille: int = 20):
    from app.models.agence import Proprietaire
    pid = db.scalar(select(Proprietaire.id).where(Proprietaire.utilisateur_id == user.id))
    if pid is None:
        return [], 0
    stmt = (
        select(Annonce)
        .join(Annonce.bien)
        .where(Bien.proprietaire_id == pid)
    )
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    items = db.scalars(
        stmt.order_by(Annonce.cree_le.desc()).offset((page - 1) * taille).limit(taille)
    ).all()
    return list(items), total