from app.core.config import get_settings
from app.integrations.storage.base import StorageProvider, UploadResult

_provider: StorageProvider | None = None


def _get_provider() -> StorageProvider | None:
    global _provider
    if _provider is not None:
        return _provider
    settings = get_settings()
    if settings.storage_provider == "cloudinary":
        from app.integrations.storage.cloudinary_provider import CloudinaryProvider
        _provider = CloudinaryProvider()
    elif settings.storage_provider == "r2":
        from app.integrations.storage.r2_provider import R2Provider
        _provider = R2Provider()
    return _provider


def upload_fichier(
    contenu: bytes, *, filename: str, content_type: str, dossier: str = ""
) -> UploadResult:
    provider = _get_provider()
    if provider is None:
        raise RuntimeError("Aucun fournisseur de stockage configuré")
    return provider.upload(
        contenu, filename=filename, content_type=content_type, dossier=dossier
    )


def supprimer_fichier(public_id: str) -> bool:
    provider = _get_provider()
    if provider is None:
        return False
    return provider.delete(public_id)


__all__ = [
    "StorageProvider", "UploadResult", "upload_fichier", "supprimer_fichier",
]