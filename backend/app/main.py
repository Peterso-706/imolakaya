from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import get_settings

settings = get_settings()

csp_media = " ".join(["'self'", "https://res.cloudinary.com"] + ([settings.r2_public_url] if settings.r2_public_url else []))
csp_connect = " ".join(["'self'"] + settings.cors_origins)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
)

# Servir les fichiers uploadés localement (fallback gratuit)
_uploads_dir = Path(settings.local_storage_path)
_uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(_uploads_dir)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = (
            f"default-src 'self'; img-src {csp_media}; media-src {csp_media}; "
            f"connect-src {csp_connect}; frame-ancestors 'none'; base-uri 'self'"
        )
        return response

app.add_middleware(SecurityHeadersMiddleware)

from fastapi import Response

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)

@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok"}