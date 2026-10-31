import re
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.exceptions import (
    BadRequestError,
    ConflictError,
    ForbiddenError,
    NotFoundError,
)
from app.models.enums import (
    SourcePaiement,
    StatutPaiement,
    TypeTransaction,
)
from app.models.paiement import Paiement
from app.models.transaction import Transaction
from app.models.utilisateur import Utilisateur
from app.schemas.paiement import (
    PaiementCreateAgence,
    PaiementCreateEnLigne,
)
from app.services.audit_service import log_action


def _creer_transaction(
    db: Session,
    paiement: Paiement,
    *,
    type_: TypeTransaction,
    user_id: UUID | None = None,
    message: str | None = None,
    donnees: dict | None = None,
) -> None:
    db.add(
        Transaction(
            paiement_id=paiement.id,
            utilisateur_id=user_id,
            type=type_,
            message=message,
            donnees=donnees,
        )
    )


def creer_paiement_en_ligne(
    db: Session, user: Utilisateur, payload: PaiementCreateEnLigne
) -> Paiement:
    """
    Crée un paiement EN_ATTENTE. Aucune confirmation ici.
    Le frontend doit rediriger vers le fournisseur (MonCash/NatCash).
    """
    paiement = Paiement(
        annonce_id=payload.annonce_id,
        proprietaire_id=user.proprietaire.id,
        montant=payload.montant,
        devise=payload.devise,
        source=SourcePaiement.EN_LIGNE,
        methode=payload.methode,
        reference=f"PENDING-{payload.annonce_id}-{user.id}-{datetime.now(timezone.utc).timestamp()}",
        statut=StatutPaiement.EN_ATTENTE,
        verifie_par_webhook=False,
    )
    db.add(paiement)
    db.flush()
    _creer_transaction(
        db, paiement,
        type_=TypeTransaction.CREATION,
        user_id=user.id,
        message="Paiement initié côté client",
    )
    db.commit()
    db.refresh(paiement)
    return paiement


def creer_paiement_agence(
    db: Session,
    employe: Utilisateur,
    payload: PaiementCreateAgence,
    *,
    ip: str | None = None,
) -> Paiement:
    """SEL-AGE-03 — enregistrement au bureau, statut EN_ATTENTE par défaut."""
    if employe.employe is None:
        raise ForbiddenError("Compte employé requis")

    paiement = Paiement(
        annonce_id=payload.annonce_id,
        proprietaire_id=payload.proprietaire_id,
        employe_id=employe.employe.id,
        montant=payload.montant,
        devise=payload.devise,
        source=SourcePaiement.AGENCE,
        methode=payload.methode,
        reference=payload.reference,
        statut=StatutPaiement.EN_ATTENTE,
        verifie_par_webhook=False,
        agent_responsable=payload.agent_responsable,
        note_interne=payload.note_interne,
        date_paiement=datetime.now(timezone.utc),
    )
    db.add(paiement)
    db.flush()
    _creer_transaction(
        db, paiement,
        type_=TypeTransaction.CREATION,
        user_id=employe.id,
        message=f"Enregistrement agence par {payload.agent_responsable}",
    )
    log_action(db, user_id=employe.id, action="paiement.agence.creation",
               entite="Paiement", entite_id=paiement.id,
               details={"reference": payload.reference}, adresse_ip=ip)
    db.commit()
    db.refresh(paiement)
    return paiement


def traiter_webhook(
    db: Session,
    *,
    reference: str,
    reference_fournisseur: str,
    statut_fournisseur: str,
    preuve: dict,
    signature_valide: bool,
) -> Paiement:
    """
    SEL-NF-04 — la seule voie "en ligne" pour confirmer un paiement.
    - `signature_valide` est calculé en amont (integrations/payments)
    - idempotent : si déjà confirmé, on ignore
    """
    if not signature_valide:
        raise ForbiddenError("Signature webhook invalide")

    paiement = db.scalar(select(Paiement).where(Paiement.reference == reference))
    if paiement is None:
        raise NotFoundError("Paiement inconnu pour cette référence")

    if paiement.statut == StatutPaiement.CONFIRME:
        # idempotence : on loggue mais on n'écrase pas
        _creer_transaction(
            db, paiement,
            type_=TypeTransaction.NOTIFICATION_RECUE,
            message="Webhook reçu mais paiement déjà confirmé",
            donnees=preuve,
        )
        db.commit()
        return paiement

    _creer_transaction(
        db, paiement,
        type_=TypeTransaction.NOTIFICATION_RECUE,
        message=f"Statut fournisseur : {statut_fournisseur}",
        donnees=preuve,
    )

    if statut_fournisseur in ("success", "completed", "paid"):
        paiement.statut = StatutPaiement.CONFIRME
        paiement.verifie_par_webhook = True
        paiement.preuve_serveur = preuve
        paiement.reference_fournisseur = reference_fournisseur
        paiement.date_confirmation = datetime.now(timezone.utc)
        _creer_transaction(
            db, paiement,
            type_=TypeTransaction.CONFIRMATION,
            message="Confirmation via webhook signé",
        )
    elif statut_fournisseur in ("failed", "cancelled"):
        paiement.statut = StatutPaiement.ECHOUE
        _creer_transaction(
            db, paiement,
            type_=TypeTransaction.ECHEC,
            message=f"Échec fournisseur : {statut_fournisseur}",
        )

    db.commit()
    db.refresh(paiement)
    return paiement


def _redact_preuve(p: str) -> str:
    p = re.sub(r"\b\d{13,19}\b", "[CARD]", p)
    p = re.sub(r"\b\d{10,15}\b", "[PHONE]", p)
    p = re.sub(r"[\w.+-]+@[\w-]+\.[\w.-]+", "[EMAIL]", p)
    return p[:120]


def confirmer_manuellement(
    db: Session,
    admin: Utilisateur,
    paiement_id: UUID,
    *,
    preuve: str,
) -> Paiement:
    """
    Voie alternative pour peman agence ou anomalies.
    Réservée aux administrateurs.
    """
    paiement = db.get(Paiement, paiement_id)
    if paiement is None:
        raise NotFoundError("Paiement introuvable")

    if paiement.statut == StatutPaiement.CONFIRME:
        raise ConflictError("Paiement déjà confirmé")

    paiement.statut = StatutPaiement.CONFIRME
    paiement.verifie_par_webhook = False  # confirmation humaine, pas webhook
    paiement.date_confirmation = datetime.now(timezone.utc)
    paiement.preuve_serveur = {"mode": "manuel", "preuve_redacted": _redact_preuve(preuve),
                               "admin_id": str(admin.id)}

    _creer_transaction(
        db, paiement,
        type_=TypeTransaction.VERIFICATION_MANUELLE,
        user_id=admin.id,
        message=f"Confirmation manuelle (preuve_len={len(preuve)})",
    )
    log_action(db, user_id=admin.id, action="paiement.confirmation_manuelle",
               entite="Paiement", entite_id=paiement.id,
               details={"preuve_len": len(preuve)})
    db.commit()
    db.refresh(paiement)
    return paiement

def lister_paiements_admin(db: Session, *, page: int = 1, taille: int = 20):
    stmt = select(Paiement)
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    items = db.scalars(
        stmt.order_by(Paiement.cree_le.desc()).offset((page - 1) * taille).limit(taille)
    ).all()
    return list(items), total


def lister_paiements_proprietaire(db: Session, user: Utilisateur, *, page: int = 1, taille: int = 20):
    if user.proprietaire is None:
        return [], 0
    stmt = select(Paiement).where(Paiement.proprietaire_id == user.proprietaire.id)
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    items = db.scalars(
        stmt.order_by(Paiement.cree_le.desc()).offset((page - 1) * taille).limit(taille)
    ).all()
    return list(items), total