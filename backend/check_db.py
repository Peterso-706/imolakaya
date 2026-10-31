from app.core.config import get_settings
from app.database.session import engine
from sqlalchemy import text

s = get_settings()
print(f"DATABASE_URL: {s.database_url}\n")

with engine.connect() as conn:
    result = conn.execute(text(
        "SELECT tablename FROM pg_tables "
        "WHERE schemaname='public' ORDER BY tablename"
    ))
    tables = [r[0] for r in result]

    print(f"{len(tables)} tables dans 'public':")
    for t in tables:
        print(f"  ✓ {t}")

    if not tables:
        print("\n⚠️  AUCUNE table — la migration n'a pas été appliquée à cette DB")
        print("   Solutions:")
        print("     alembic downgrade base")
        print("     alembic upgrade head")