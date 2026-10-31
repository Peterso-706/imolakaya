import hashlib
from datetime import date, datetime, timezone
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, NotFoundError
from app.models.bien import Bien
from app.models.enums import (
    SourceVisite,
    StatutAvis,
    StatutContact,
    TypeNotification,
)
from app.models.interaction import Avis, Contact, Favori, Notification, Visite
from app.models.utilisateur import Utilisateur
from app.schemas.interaction import (
    AvisCreate,
    ContactCreatePublic,
    VisiteCreate,
)
from app.services.audit_service import log_action


# --- Contact --------------------------------------------------------------
def creer_contact(
    db: Session, payload: ContactCreatePublic, *, user: Utilisateur | None
) -> Contact:
    bien = db.get(Bien, payload.bien_id)
    if bien is None or bien.est_supprime:
        raise NotFoundError("Bien introuvable")

    contact = Contact(
        bien_id=bien.id,
        proprietaire_id=bien.proprietaire_id,
        utilisateur_id=user.id if user else None,
        nom_visiteur=payload.nom_visiteur,
        email_visiteur=payload.email_visiteur,
        telephone_visiteur=payload.telephone_visiteur,
        message=payload.message,
        statut=StatutContact.NOUVEAU,
    )
    db.add(contact)
    db.flush()
    # Notifier le propriétaire
    _notifier(
        db,
        utilisateur_id=_utilisateur_du_proprietaire(db, bien.proprietaire_id),
        type_=TypeNotification.CONTACT_RECU,
        titre="Nouvelle demande de contact",
        message=f"Bien : {bien.titre}",
        lien=f"/proprietaire/contacts/{contact.id}",
    )
    db.commit()
    db.refresh(contact)
    return contact


def _utilisateur_du_proprietaire(db: Session, proprietaire_id: UUID) -> UUID | None:
    from app.models.agence import Proprietaire
    p = db.get(Proprietaire, proprietaire_id)
    return p.utilisateur_id if p else None


# --- Visite (avec déduplication) -----------------------------------------
def enregistrer_visite(
    db: Session,
    payload: VisiteCreate,
    *,
    user: Utilisateur | None,
    adresse_ip: str | None,
    user_agent: str | None,
) -> Visite | None:
    """RG-08 — événement réel, dédupliqué par (bien, ip, ua, jour)."""
    bien = db.get(Bien, payload.bien_id)
    if bien is None or bien.est_supprime or not bien.est_actif:
        return None

    jour = date.today().isoformat()
    raw = f"{bien.id}:{adresse_ip or '-'}:{user_agent or '-'}:{jour}"
    cle = hashlib.sha256(raw.encode()).hexdigest()

    existant = db.scalar(select(Visite).where(Visite.cle_deduplication == cle))
    if existant:
        return existant  # déduplication silencieuse

    visite = Visite(
        bien_id=bien.id,
        utilisateur_id=user.id if user else None,
        source=payload.source or SourceVisite.PUBLIC,
        adresse_ip=adresse_ip,
        user_agent=user_agent,
        cle_deduplication=cle,
    )
    db.add(visite)
    db.commit()
    db.refresh(visite)
    return visite


def stats_visites(db: Session, bien_id: UUID) -> dict:
    """RG-08 — stats calculées, jamais inventées."""
    from datetime import timedelta
    now = datetime.now(timezone.utc)
    total = db.scalar(select(func.count()).where(Visite.bien_id == bien_id)) or 0
    sept = db.scalar(
        select(func.count()).where(
            Visite.bien_id == bien_id,
            Visite.cree_le >= now - timedelta(days=7),
        )
    ) or 0
    trente = db.scalar(
        select(func.count()).where(
            Visite.bien_id == bien_id,
            Visite.cree_le >= now - timedelta(days=30),
        )
    ) or 0
    return {"bien_id": bien_id, "total_visites": total,
            "visites_7_jours": sept, "visites_30_jours": trente}


# --- Avis -----------------------------------------------------------------
def creer_avis(
    db: Session, payload: AvisCreate, *, user: Utilisateur | None
) -> Avis:
    bien = db.get(Bien, payload.bien_id)
    if bien is None:
        raise NotFoundError("Bien introuvable")

    avis = Avis(
        bien_id=bien.id,
        utilisateur_id=user.id if user else None,
        nom_auteur=payload.nom_auteur or (user.nom if user else None),
        note=payload.note,
        commentaire=payload.commentaire,
        statut=StatutAvis.EN_ATTENTE,
    )
    db.add(avis)
    db.flush()
    log_action(db, user_id=user.id if user else None,
               action="avis.creation", entite="Avis", entite_id=avis.id)
    db.commit()
    db.refresh(avis)
    return avis


# --- Favoris --------------------------------------------------------------
def ajouter_favori(db: Session, user: Utilisateur, bien_id: UUID) -> Favori:
    bien = db.get(Bien, bien_id)
    if bien is None:
        raise NotFoundError("Bien introuvable")
    existant = db.scalar(
        select(Favori).where(
            Favori.utilisateur_id == user.id, Favori.bien_id == bien_id
        )
    )
    if existant:
        raise ConflictError("Déjà en favori")
    fav = Favori(utilisateur_id=user.id, bien_id=bien_id)
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return fav


def retirer_favori(db: Session, user: Utilisateur, bien_id: UUID) -> None:
    fav = db.scalar(
        select(Favori).where(
            Favori.utilisateur_id == user.id, Favori.bien_id == bien_id
        )
    )
    if fav:
        db.delete(fav)
        db.commit()


# --- Notifications --------------------------------------------------------
def _notifier(
    db: Session,
    *,
    utilisateur_id: UUID | None,
    type_: TypeNotification,
    titre: str,
    message: str,
    lien: str | None = None,
) -> Notification | None:
    if utilisateur_id is None:
        return None
    notif = Notification(
        utilisateur_id=utilisateur_id,
        type=type_, titre=titre, message=message, lien=lien,
    )
    db.add(notif)
    return notif


def marquer_notification_lue(
    db: Session, user: Utilisateur, notif_id: UUID
) -> Notification:
    notif = db.get(Notification, notif_id)
    if notif is None or notif.utilisateur_id != user.id:
        raise NotFoundError("Notification introuvable")
    notif.est_lue = True
    notif.date_lecture = datetime.now(timezone.utc)
    db.commit()
    db.refresh(notif)
    return notif

def lister_contacts_proprietaire(db: Session, user: Utilisateur, *, page: int = 1, taille: int = 20):
    if user.proprietaire is None:
        return [], 0
    stmt = select(Contact).where(Contact.proprietaire_id == user.proprietaire.id)
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    items = db.scalars(
        stmt.order_by(Contact.cree_le.desc()).offset((page - 1) * taille).limit(taille)
    ).all()
    return list(items), total


def lister_notifications(db: Session, user: Utilisateur, *, page: int = 1, taille: int = 20):
    stmt = select(Notification).where(Notification.utilisateur_id == user.id)
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    items = db.scalars(
        stmt.order_by(Notification.cree_le.desc()).offset((page - 1) * taille).limit(taille)
    ).all()
    return list(items), total


def lister_favoris(db: Session, user: Utilisateur):
    return db.scalars(
        select(Favori).where(Favori.utilisateur_id == user.id)
    ).all()