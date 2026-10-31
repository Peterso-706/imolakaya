from app.database.session import engine
from sqlalchemy import text

with engine.begin() as conn:
    # Drop toutes les tables
    conn.execute(text("""
        DO $$ DECLARE
            r RECORD;
        BEGIN
            FOR r IN SELECT tablename FROM pg_tables WHERE schemaname='public' LOOP
                EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
            END LOOP;
        END $$;
    """))
    # Drop tous les types enum
    conn.execute(text("""
        DO $$ DECLARE
            r RECORD;
        BEGIN
            FOR r IN SELECT typname FROM pg_type WHERE typtype='e' LOOP
                EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
            END LOOP;
        END $$;
    """))
    print("Base nettoyée : 0 table, 0 enum")

    