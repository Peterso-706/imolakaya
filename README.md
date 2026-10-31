# ImolaKaya — Plateforme immobilière en Haïti

Backend FastAPI + Frontend Next.js, déployés séparément (Render + Vercel).

## Stack technique

- **Backend** : FastAPI, SQLAlchemy 2, PostgreSQL, Alembic, Pydantic v2
- **Frontend** : Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Auth** : JWT (HS256), permissions par rôle
- **Stockage médias** : Cloudinary / R2
- **Paiements** : MonCash / NatCash (webhooks HMAC)

## Prérequis

- Python 3.12
- Node.js 20
- PostgreSQL 14+

## Lancement local

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Variables d’environnement

Copier `backend/.env.example` → `backend/.env` et `frontend/.env.example` → `frontend/.env.local`, puis remplir les secrets.

**Ne jamais commiter `.env` / `.env.local`.**

## Déploiement

### Backend (Render)
- Root Directory : `backend`
- Build Command : `pip install -r requirements.txt && alembic upgrade head`
- Start Command : `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health Check Path : `/health`
- Python version : `3.12.10` (via `backend/runtime.txt`)

### Frontend (Vercel)
- Root Directory : `frontend`
- Build Command : `npm run build`
- Env vars : `NEXT_PUBLIC_API_URL=https://<backend>.onrender.com/api/v1`

### Base de données
- Render PostgreSQL (ou externe).
- `DATABASE_URL` au format `postgresql+psycopg://...`

## Sécurité
- Secrets stockés dans les dashboards Render/Vercel (pas dans le repo).
- CORS restreint aux origines autorisées.
- Headers de sécurité (HSTS, CSP, X-Frame-Options, etc.) activés.
- Rate limiting sur les endpoints sensibles.

## Licence
Projet privé — tous droits réservés.