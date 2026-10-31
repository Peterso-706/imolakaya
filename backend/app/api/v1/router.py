from fastapi import APIRouter

from app.routes import admin, proprietaire, public
from app.routes.auth import router as auth_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(public.router, prefix="/public", tags=["public"])
api_router.include_router(proprietaire.router, prefix="/proprietaire", tags=["proprietaire"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])