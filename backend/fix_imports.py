from pathlib import Path

count = 0
for f in Path("app").rglob("*.py"):
    try:
        texte = f.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        continue
    nouveau = texte.replace("from backend.app.", "from app.")
    nouveau = nouveau.replace("import backend.app.", "import app.")
    if nouveau != texte:
        f.write_text(nouveau, encoding="utf-8")
        count += 1
        print(f"✔ {f} corrigé")

print(f"\n{count} fichier(s) corrigé(s)")