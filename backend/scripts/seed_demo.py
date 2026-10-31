"""
Seed de démonstration.
Crée :
- admin_principal@imolakaya.com / Admin@2026!
- admin@imolakaya.com / Admin@2026!
- proprio1@imolakaya.com / Proprio@2026!
- employe1@imolakaya.com / Employe@2026!
- 1 agence, 1 employé, 2 propriétaires
- 6 biens (dont 1 location, 1 vendu, 1 retiré)
- 3 annonces publiées, 1 brouillon, 1 rejetée
- 1 paiement confirmé (pour l'annonce publiée)
⚠ Ne pas exécuter en production.
"""
import sys
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select

from app.core.config import get_settings
from app.core.security import hash_password
from app.database.session import SessionLocal
from app.models.agence import Agence, Employe, Proprietaire
from app.models.annonce import Annonce
from app.models.bien import Bien, Categorie, Localisation
from app.models.enums import (
    Devise,
    FrequencePaiement,
    MethodePaiement,
    SourcePaiement,
    StatutAnnonce,
    StatutBien,
    StatutPaiement,
    TypeLocation,
    TypeOperation,
)
from app.models.paiement import Paiement
from app.models.role import Role
from app.models.transaction import Transaction
from app.models.utilisateur import Utilisateur


def _creer_utilisateur(db, email, password, nom, role_nom):
    if db.scalar(select(Utilisateur).where(Utilisateur.email == email)):
        return db.scalar(select(Utilisateur).where(Utilisateur.email == email))
    user = Utilisateur(
        email=email,
        mot_de_passe_hash=hash_password(password),
        nom=nom,
        est_actif=True,
        est_verifie=True,
    )
    role = db.scalar(select(Role).where(Role.nom == role_nom))
    if role:
        user.roles.append(role)
    db.add(user)
    db.flush()
    return user


def main() -> None:
    settings = get_settings()
    if settings.is_production:
        raise SystemExit("⛔ Ne pas exécuter seed_demo en production")

    db = SessionLocal()
    try:
        # --- Utilisateurs ---
        admin_p = _creer_utilisateur(db, "admin_principal@imolakaya.com",
                                     "Admin@2026!", "Admin Principal", "admin_principal")
        admin = _creer_utilisateur(db, "admin@imolakaya.com",
                                   "Admin@2026!", "Admin Secondaire", "admin")
        proprio_user = _creer_utilisateur(db, "proprio1@imolakaya.com",
                                          "Proprio@2026!", "Jean Baptiste", "proprietaire")
        employe_user = _creer_utilisateur(db, "employe1@imolakaya.com",
                                          "Employe@2026!", "Marie Pierre", "employe")
        db.commit()

        # --- Propriétaire ---
        proprio = db.scalar(
            select(Proprietaire).where(Proprietaire.utilisateur_id == proprio_user.id)
        )
        if proprio is None:
            proprio = Proprietaire(utilisateur_id=proprio_user.id)
            db.add(proprio)
            db.flush()

        # --- Agence + employé ---
        agence = db.scalar(select(Agence).where(Agence.nom == "ImoLakaya Port-au-Prince"))
        if agence is None:
            agence = Agence(
                nom="ImoLakaya Port-au-Prince",
                adresse="Delmas 33, Port-au-Prince",
                telephone="+509 3600 0000",
                email="pap@imolakaya.com",
            )
            db.add(agence)
            db.flush()

        employe = db.scalar(
            select(Employe).where(Employe.utilisateur_id == employe_user.id)
        )
        if employe is None:
            employe = Employe(
                utilisateur_id=employe_user.id,
                agence_id=agence.id,
                matricule="EMP-001",
                poste="Agent immobilier",
            )
            db.add(employe)
            db.flush()

        # --- Catégories + Localisations ---
        maison = db.scalar(select(Categorie).where(Categorie.slug == "maison"))
        appart = db.scalar(select(Categorie).where(Categorie.slug == "appartement"))
        terrain = db.scalar(select(Categorie).where(Categorie.slug == "terrain"))

        loc_pv = db.scalar(
            select(Localisation).where(Localisation.zone == "Pétion-Ville")
        )
        loc_delmas = db.scalar(
            select(Localisation).where(Localisation.zone == "Delmas")
        )

        # --- Biens ---
        biens_specs = [
            {
                "titre": "Villa moderne à Pétion-Ville",
                "description": "Belle villa 4 chambres avec piscine, vue sur la ville.",
                "type_operation": TypeOperation.VENTE,
                "type_location": None,
                "prix": Decimal("250000.00"),
                "devise": Devise.USD,
                "categorie_id": maison.id,
                "localisation_id": loc_pv.id,
                "nombre_chambres": 4,
                "nombre_salles_bain": 3,
                "superficie_m2": Decimal("320.00"),
                "statut": StatutBien.DISPONIBLE,
            },
            {
                "titre": "Appartement 2 chambres à Delmas",
                "description": "Appartement rénové, proche des commodités.",
                "type_operation": TypeOperation.LOCATION,
                "type_location": TypeLocation.APPARTEMENT,
                "prix": Decimal("35000.00"),
                "devise": Devise.HTG,
                "frequence_paiement": FrequencePaiement.MENSUEL,
                "categorie_id": appart.id,
                "localisation_id": loc_delmas.id,
                "nombre_chambres": 2,
                "nombre_salles_bain": 1,
                "superficie_m2": Decimal("85.00"),
                "statut": StatutBien.DISPONIBLE,
            },
            {
                "titre": "Terrain 500 m² à Pétion-Ville",
                "description": "Terrain titré, idéal pour construction.",
                "type_operation": TypeOperation.VENTE,
                "type_location": None,
                "prix": Decimal("180000.00"),
                "devise": Devise.USD,
                "categorie_id": terrain.id,
                "localisation_id": loc_pv.id,
                "superficie_m2": Decimal("500.00"),
                "statut": StatutBien.VENDU,
            },
            {
                "titre": "Maison familiale à Delmas 33",
                "description": "Maison 3 chambres avec cour.",
                "type_operation": TypeOperation.LOCATION,
                "type_location": TypeLocation.LOGEMENT_ENTIER,
                "prix": Decimal("55000.00"),
                "devise": Devise.HTG,
                "frequence_paiement": FrequencePaiement.MENSUEL,
                "categorie_id": maison.id,
                "localisation_id": loc_delmas.id,
                "nombre_chambres": 3,
                "nombre_salles_bain": 2,
                "superficie_m2": Decimal("140.00"),
                "statut": StatutBien.LOUE,
            },
            {
                "titre": "Appartement meublé Pétion-Ville",
                "description": "Appartement meublé, 1 chambre, charges comprises.",
                "type_operation": TypeOperation.LOCATION,
                "type_location": TypeLocation.APPARTEMENT,
                "prix": Decimal("400.00"),
                "devise": Devise.USD,
                "frequence_paiement": FrequencePaiement.MENSUEL,
                "categorie_id": appart.id,
                "localisation_id": loc_pv.id,
                "nombre_chambres": 1,
                "nombre_salles_bain": 1,
                "superficie_m2": Decimal("55.00"),
                "statut": StatutBien.DISPONIBLE,
            },
            {
                "titre": "Maison retirée à Delmas",
                "description": "Retirée par le propriétaire pour rénovation.",
                "type_operation": TypeOperation.VENTE,
                "type_location": None,
                "prix": Decimal("120000.00"),
                "devise": Devise.USD,
                "categorie_id": maison.id,
                "localisation_id": loc_delmas.id,
                "nombre_chambres": 3,
                "nombre_salles_bain": 2,
                "statut": StatutBien.RETIRE,
            },
        ]

        biens = []
        for spec in biens_specs:
            existing = db.scalar(select(Bien).where(Bien.titre == spec["titre"]))
            if existing:
                biens.append(existing)
                continue
            bien = Bien(proprietaire_id=proprio.id, **spec)
            db.add(bien)
            db.flush()
            biens.append(bien)

        # --- Annonces ---
        now = datetime.now(timezone.utc)

        annonces_specs = [
            (biens[0], StatutAnnonce.PUBLIEE),
            (biens[1], StatutAnnonce.PUBLIEE),
            (biens[4], StatutAnnonce.PUBLIEE),
            (biens[2], StatutAnnonce.BROUILLON),
            (biens[5], StatutAnnonce.REJETEE),
        ]

        annonces = []
        for bien, statut in annonces_specs:
            existing = db.scalar(select(Annonce).where(Annonce.bien_id == bien.id))
            if existing:
                annonces.append(existing)
                continue
            a = Annonce(
                bien_id=bien.id,
                titre=bien.titre,
                description=bien.description,
                statut=statut,
                date_soumission=now - timedelta(days=10),
                date_publication=now - timedelta(days=8) if statut == StatutAnnonce.PUBLIEE else None,
                date_expiration=now + timedelta(days=22) if statut == StatutAnnonce.PUBLIEE else None,
                valide_par_id=admin.id if statut in (StatutAnnonce.PUBLIEE, StatutAnnonce.REJETEE) else None,
                motif_rejet="Description trop courte" if statut == StatutAnnonce.REJETEE else None,
            )
            db.add(a)
            db.flush()
            annonces.append(a)

        # --- Paiement confirmé pour la 1re annonce publiée ---
        premiere_annonce = annonces[0]
        if not db.scalar(select(Paiement).where(Paiement.annonce_id == premiere_annonce.id)):
            paiement = Paiement(
                annonce_id=premiere_annonce.id,
                proprietaire_id=proprio.id,
                montant=Decimal("1500.00"),
                devise=Devise.HTG,
                source=SourcePaiement.EN_LIGNE,
                methode=MethodePaiement.MONCASH,
                reference="DEMO-MONCASH-001",
                reference_fournisseur="MC-REF-001",
                statut=StatutPaiement.CONFIRME,
                verifie_par_webhook=True,
                preuve_serveur={"status": "success", "demo": True},
                date_paiement=now - timedelta(days=9),
                date_confirmation=now - timedelta(days=9),
            )
            db.add(paiement)
            db.flush()
            db.add(Transaction(
                paiement_id=paiement.id,
                type="confirmation",
                message="Seed demo — confirmation simulée",
            ))

        db.commit()
        print("\n✅ Seed démo terminé")
        print("Comptes :")
        print("  admin_principal@imolakaya.com / Admin@2026!")
        print("  admin@imolakaya.com           / Admin@2026!")
        print("  proprio1@imolakaya.com        / Proprio@2026!")
        print("  employe1@imolakaya.com        / Employe@2026!")
    finally:
        db.close()


if __name__ == "__main__":
    main()