"""
Création d'un compte administrateur en production.
Usage (Render Shell ou build) :
    python -m scripts.create_admin
Variables optionnelles :
    ADMIN_EMAIL (défaut: admin@imolakaya.com)
    ADMIN_PASSWORD (défaut: Admin@2026!)
    ADMIN_NOM (défaut: Administrateur)
    ADMIN_ROLE (défaut: admin_principal)
"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.security import hash_password
from app.database.session import SessionLocal
from app.models.role import Role
from app.models.utilisateur import Utilisateur
from sqlalchemy import select


def main() -> None:
    email = os.getenv("ADMIN_EMAIL", "admin@imolakaya.com")
    password = os.getenv("ADMIN_PASSWORD", "Admin@2026!")
    nom = os.getenv("ADMIN_NOM", "Administrateur")
    role_nom = os.getenv("ADMIN_ROLE", "admin_principal")

    db = SessionLocal()
    try:
        user = db.scalar(select(Utilisateur).where(Utilisateur.email == email))
        if user is None:
            user = Utilisateur(
                email=email,
                mot_de_passe_hash=hash_password(password),
                nom=nom,
                est_actif=True,
                est_verifie=True,
            )
            db.add(user)
            db.flush()
            print(f"✔ Utilisateur créé : {email}")
        else:
            user.mot_de_passe_hash = hash_password(password)
            user.est_actif = True
            user.est_verifie = True
            print(f"✔ Utilisateur mis à jour : {email}")

        role = db.scalar(select(Role).where(Role.nom == role_nom))
        if role is None:
            print(f"⚠ Rôle '{role_nom}' introuvable — lancez d'abord seed_reference")
        else:
            if role not in user.roles:
                user.roles.append(role)
            print(f"✔ Rôle '{role_nom}' assigné")

        db.commit()
        print("✅ Admin prêt")
        print(f"   Email    : {email}")
        print(f"   Mot de passe : {password}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
PY