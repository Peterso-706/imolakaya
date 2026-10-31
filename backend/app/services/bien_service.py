from uuid import UUID

from sqlalchemy import and_, func, select
from sqlalchemy.orm import Session, joinedload

from app.core.exceptions import ForbiddenError, NotFoundError
from app.models.agence import Proprietaire
from app.models.bien import Bien
from app.models.enums import StatutBien
from app.models.utilisateur import Utilisateur
from app.schemas.bien import BienCreate, BienSearchParams, BienUpdate
from app.services.audit_service import log_action


def _charge_bien_ou_404(db: Session, bien_id: UUID) -> Bien:
    bien = db.scalar(
        select(Bien)
        .options(joinedload(Bien.categorie), joinedload(Bien.localisation))
        .where(Bien.id == bien_id, Bien.est_supprime.is_(False))
    )
    if bien is None:
        raise NotFoundError("Bien introuvable")
    return bien


def _assert_proprietaire(user: Utilisateur, bien: Bien) -> None:
    """RG-02 — un propriétaire ne peut modifier que ses propres biens."""
    if user.proprietaire is None or bien.proprietaire_id != user.proprietaire.id:
        raise ForbiddenError("Ce bien n'appartient pas à cet utilisateur")


def get_proprietaire_id(db: Session, user: Utilisateur) -> UUID:
    proprietaire = db.scalar(
        select(Proprietaire).where(Proprietaire.utilisateur_id == user.id)
    )
    if proprietaire is None:
        raise ForbiddenError("Profil propriétaire inexistant")
    return proprietaire.id


def creer_bien(
    db: Session,
    user: Utilisateur,
    payload: BienCreate,
    *,
    employe_id: UUID | None = None,
    ip: str | None = None,
    ua: str | None = None,
) -> Bien:
    proprietaire_id = get_proprietaire_id(db, user)

    bien = Bien(
        proprietaire_id=proprietaire_id,
        employe_createur_id=employe_id,
        **payload.model_dump(),
    )
    db.add(bien)
    db.flush()

    log_action(
        db,
        user_id=user.id,
        action="bien.creation",
        entite="Bien",
        entite_id=bien.id,
        details={"titre": bien.titre, "en_agence": employe_id is not None},
        adresse_ip=ip,
        user_agent=ua,
    )
    db.commit()
    db.refresh(bien)
    return bien


def modifier_bien(
    db: Session,
    user: Utilisateur,
    bien_id: UUID,
    payload: BienUpdate,
    *,
    ip: str | None = None,
    ua: str | None = None,
) -> Bien:
    bien = _charge_bien_ou_404(db, bien_id)
    _assert_proprietaire(user, bien)

    donnees = payload.model_dump(exclude_unset=True)
    for champ, valeur in donnees.items():
        setattr(bien, champ, valeur)

    log_action(
        db,
        user_id=user.id,
        action="bien.modification",
        entite="Bien",
        entite_id=bien.id,
        details={"champs": list(donnees.keys())},
        adresse_ip=ip,
        user_agent=ua,
    )
    db.commit()
    db.refresh(bien)
    return bien


def supprimer_bien(
    db: Session, user: Utilisateur, bien_id: UUID, *, ip: str | None = None
) -> None:
    """RG-10 — soft delete, jamais delete physique."""
    bien = _charge_bien_ou_404(db, bien_id)
    _assert_proprietaire(user, bien)

    bien.est_supprime = True
    bien.est_actif = False
    bien.statut = StatutBien.RETIRE

    log_action(
        db,
        user_id=user.id,
        action="bien.suppression_logique",
        entite="Bien",
        entite_id=bien.id,
        adresse_ip=ip,
    )
    db.commit()


def rechercher_biens(
    db: Session, params: BienSearchParams
) -> tuple[list[Bien], int]:
    stmt = select(Bien).where(
        Bien.est_supprime.is_(False),
        Bien.est_actif.is_(True),
        Bien.statut == (params.statut or StatutBien.DISPONIBLE),
    )

    if params.q:
        like = f"%{params.q}%"
        stmt = stmt.where(
            Bien.titre.ilike(like) | Bien.description.ilike(like)
        )
    if params.type_operation:
        stmt = stmt.where(Bien.type_operation == params.type_operation)
    if params.type_location:
        stmt = stmt.where(Bien.type_location == params.type_location)
    if params.categorie_id:
        stmt = stmt.where(Bien.categorie_id == params.categorie_id)
    if params.prix_min is not None:
        stmt = stmt.where(Bien.prix >= params.prix_min)
    if params.prix_max is not None:
        stmt = stmt.where(Bien.prix <= params.prix_max)

    # filtre localisation via jointure
    if params.departement or params.commune or params.zone:
        from app.models.bien import Localisation
        stmt = stmt.join(Localisation, Bien.localisation_id == Localisation.id)
        if params.departement:
            stmt = stmt.where(Localisation.departement == params.departement)
        if params.commune:
            stmt = stmt.where(Localisation.commune == params.commune)
        if params.zone:
            stmt = stmt.where(Localisation.zone == params.zone)

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    offset = (params.page - 1) * params.taille
    items = db.scalars(
        stmt.order_by(Bien.cree_le.desc()).offset(offset).limit(params.taille)
    ).all()
    return list(items), total

def lister_biens_admin(db: Session, *, page: int = 1, taille: int = 20):
    stmt = select(Bien).where(Bien.est_supprime.is_(False))
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    items = db.scalars(
        stmt.order_by(Bien.cree_le.desc()).offset((page - 1) * taille).limit(taille)
    ).all()
    return list(items), total


def lister_biens_proprietaire(db: Session, user: Utilisateur, *, page: int = 1, taille: int = 20):
    pid = get_proprietaire_id(db, user)
    stmt = select(Bien).where(
        Bien.proprietaire_id == pid, Bien.est_supprime.is_(False)
    )
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    items = db.scalars(
        stmt.order_by(Bien.cree_le.desc()).offset((page - 1) * taille).limit(taille)
    ).all()
    return list(items), total

def stats_marche(db: Session) -> dict:
    """RG-08 — toutes les stats viennent de la base réelle."""
    from sqlalchemy import func
    from app.models.bien import Bien
    from app.models.enums import StatutBien

    total = db.scalar(select(func.count()).select_from(Bien)) or 0
    disponibles = db.scalar(
        select(func.count()).select_from(Bien).where(Bien.statut == StatutBien.DISPONIBLE)
    ) or 0
    vendus = db.scalar(
        select(func.count()).select_from(Bien).where(Bien.statut == StatutBien.VENDU)
    ) or 0
    loues = db.scalar(
        select(func.count()).select_from(Bien).where(Bien.statut == StatutBien.LOUE)
    ) or 0
    return {"total": total, "disponibles": disponibles,
            "vendus": vendus, "loues": loues}