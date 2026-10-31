"""
Seed des données de référence.
- Rôles et permissions (aligné sur app/core/permissions.py)
- Catégories de biens
- Localisations Haïti (départements et communes)
Idempotent : utilise ON CONFLICT DO NOTHING.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert

from app.core.permissions import ROLE_PERMISSIONS, Permissions, Roles
from app.database.session import SessionLocal
from app.models.bien import Categorie, Localisation
from app.models.role import Permission, Role


CATEGORIES = [
    {"nom": "Maison", "slug": "maison", "ordre": 1, "icone": "home"},
    {"nom": "Appartement", "slug": "appartement", "ordre": 2, "icone": "building"},
    {"nom": "Terrain", "slug": "terrain", "ordre": 3, "icone": "map"},
    {"nom": "Local commercial", "slug": "local-commercial", "ordre": 4, "icone": "store"},
    {"nom": "Villa", "slug": "villa", "ordre": 5, "icone": "villa"},
    {"nom": "Chambre", "slug": "chambre", "ordre": 6, "icone": "bed"},
    {"nom": "Bureau", "slug": "bureau", "ordre": 7, "icone": "briefcase"},
    {"nom": "Entrepôt", "slug": "entrepot", "ordre": 8, "icone": "warehouse"},
]

# Départements d'Haïti et quelques communes représentatives
LOCALISATIONS = [
    # Ouest
    ("Ouest", "Port-au-Prince", "Pétion-Ville"),
    ("Ouest", "Port-au-Prince", "Delmas"),
    ("Ouest", "Port-au-Prince", "Tabarre"),
    ("Ouest", "Port-au-Prince", "Croix-des-Bouquets"),
    ("Ouest", "Port-au-Prince", "Carrefour"),
    ("Ouest", "Léogâne", "Léogâne"),
    ("Ouest", "Jacmel", "Jacmel"),
    # Nord
    ("Nord", "Cap-Haïtien", "Cap-Haïtien"),
    ("Nord", "Limonade", "Limonade"),
    # Artibonite
    ("Artibonite", "Gonaïves", "Gonaïves"),
    ("Artibonite", "Saint-Marc", "Saint-Marc"),
    # Sud
    ("Sud", "Les Cayes", "Les Cayes"),
    ("Sud", "Jérémie", "Jérémie"),
    # Sud-Est
    ("Sud-Est", "Jacmel", "Jacmel"),
    # Nippes
    ("Nippes", "Miragoâne", "Miragoâne"),
    # Centre
    ("Centre", "Hinche", "Hinche"),
    # Nord-Est
    ("Nord-Est", "Fort-Liberté", "Fort-Liberté"),
    # Nord-Ouest
    ("Nord-Ouest", "Port-de-Paix", "Port-de-Paix"),
    # Grand'Anse
    ("Grand'Anse", "Jérémie", "Jérémie"),
]


def seed_roles_et_permissions(db) -> None:
    # 1. Toutes les permissions
    codes = [
        v for k, v in vars(Permissions).items()
        if not k.startswith("_") and isinstance(v, str)
    ]
    for code in codes:
        stmt = insert(Permission).values(code=code, description=code).on_conflict_do_nothing(
            index_elements=["code"]
        )
        db.execute(stmt)
    db.commit()

    perms_map = {p.code: p for p in db.scalars(select(Permission)).all()}

    # 2. Rôles et permissions associées
    for role_nom, perms in ROLE_PERMISSIONS.items():
        role = db.scalar(select(Role).where(Role.nom == role_nom))
        if role is None:
            role = Role(nom=role_nom, description=f"Rôle {role_nom}")
            db.add(role)
            db.flush()

        role.permissions = []  # reset
        if perms == ["*"]:
            role.permissions = list(perms_map.values())
        else:
            role.permissions = [perms_map[p] for p in perms if p in perms_map]
        db.flush()

    db.commit()
    print("✔ Rôles et permissions seedés")


def seed_categories(db) -> None:
    for cat in CATEGORIES:
        stmt = insert(Categorie).values(
            nom=cat["nom"],
            slug=cat["slug"],
            description=cat.get("description"),
            icone=cat.get("icone"),
            ordre=cat["ordre"],
            est_active=True,
        ).on_conflict_do_nothing(index_elements=["slug"])
        db.execute(stmt)
    db.commit()
    print(f"✔ {len(CATEGORIES)} catégories seedées")


def seed_localisations(db) -> None:
    for dept, commune, zone in LOCALISATIONS:
        stmt = insert(Localisation).values(
            departement=dept,
            commune=commune,
            zone=zone,
        ).on_conflict_do_nothing(
            index_elements=["departement", "commune", "zone"]
        )
        db.execute(stmt)
    db.commit()
    print(f"✔ {len(LOCALISATIONS)} localisations seedées")


def main() -> None:
    db = SessionLocal()
    try:
        seed_roles_et_permissions(db)
        seed_categories(db)
        seed_localisations(db)
        print("\n✅ Seed de référence terminé")
    finally:
        db.close()


if __name__ == "__main__":
    main()