"""Lazy loading des sous-modules pour éviter les imports circulaires."""
import importlib

_SERVICES = {
    "annonce_service",
    "audit_service",
    "auth_service",
    "bien_service",
    "interaction_service",
    "media_service",
    "paiement_service",
    "utilisateur_service",
}


def __getattr__(name: str):
    if name in _SERVICES:
        return importlib.import_module(f"app.services.{name}")
    raise AttributeError(f"module 'app.services' has no attribute {name!r}")