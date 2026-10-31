"""
RÉINITIALISATION DEV UNIQUEMENT.
- Drop toutes les tables (via alembic downgrade base)
- Recrée le schéma
- Relance seed_reference + seed_demo
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def run(cmd: list[str]) -> None:
    print(f"\n$ {' '.join(cmd)}")
    subprocess.run(cmd, cwd=ROOT, check=True)


def main() -> None:
    from app.core.config import get_settings
    if get_settings().is_production:
        raise SystemExit("⛔ reset_dev interdit en production")

    run(["alembic", "downgrade", "base"])
    run(["alembic", "upgrade", "head"])
    run([sys.executable, "-m", "scripts.seed_reference"])
    run([sys.executable, "-m", "scripts.seed_demo"])
    print("\n✅ Base de dev réinitialisée")


if __name__ == "__main__":
    main()