import cloudinary
import cloudinary.uploader

from app.core.config import get_settings
from app.integrations.storage.base import StorageProvider, UploadResult


class CloudinaryProvider(StorageProvider):
    def __init__(self) -> None:
        settings = get_settings()
        if not settings.cloudinary_url:
            raise RuntimeError("CLOUDINARY_URL non configuré")
        cloudinary.config(url=settings.cloudinary_url, secure=True)
        self._folder = settings.cloudinary_folder

    def upload(
        self, contenu: bytes, *, filename: str, content_type: str, dossier: str = ""
    ) -> UploadResult:
        resource_type = "video" if content_type.startswith("video/") else "image"
        folder = f"{self._folder}/{dossier}".rstrip("/")
        result = cloudinary.uploader.upload(
            contenu,
            resource_type=resource_type,
            folder=folder,
            use_filename=True,
            unique_filename=True,
            overwrite=False,
        )
        return UploadResult(
            url=result["secure_url"],
            public_id=result["public_id"],
            format=result.get("format"),
            taille_octets=result.get("bytes"),
            largeur=result.get("width"),
            hauteur=result.get("height"),
            duree_secondes=result.get("duration") and int(result["duration"]),
        )

    def delete(self, public_id: str) -> bool:
        # essaie image puis video
        for rtype in ("image", "video"):
            r = cloudinary.uploader.destroy(public_id, resource_type=rtype)
            if r.get("result") == "ok":
                return True
        return False