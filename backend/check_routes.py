from pathlib import Path

required = {
    "app/routes/public": ["biens", "contacts", "visites", "avis", "referentiels", "webhooks"],
    "app/routes/proprietaire": ["biens", "medias", "upload", "annonces", "paiements", "contacts", "notifications", "favoris"],
    "app/routes/admin": ["utilisateurs", "biens", "annonces", "paiements", "referentiels", "agences", "rapports", "audit"],
}

for dossier, modules in required.items():
    d = Path(dossier)
    print(f"\n📁 {dossier}")
    for mod in modules:
        f = d / f"{mod}.py"
        if f.exists():
            print(f"  ✓ {mod}.py ({f.stat().st_size} bytes)")
        else:
            print(f"  ✗ {mod}.py MANQUANT")

# auth.py séparément
auth = Path("app/routes/auth.py")
print(f"\n📁 app/routes/")
if auth.exists():
    print(f"  ✓ auth.py ({auth.stat().st_size} bytes)")
else:
    print(f"  ✗ auth.py MANQUANT")