import os
import uuid
from pathlib import Path

from app.core.config import get_settings
from app.integrations.storage.base import StorageProvider, UploadResult


class LocalProvider(StorageProvider):
    def __init__(self) -> None:
        settings = get_settings()
        self._root = Path(settings.local_storage_path)
        self._root.mkdir(parents=True, exist_ok=True)
        self._base_url = settings.media_base_url.rstrip("/")

    def upload(self, contenu: bytes, *, filename: str, content_type: str, dossier: str = "") -> UploadResult:
        dossier = (dossier or "").strip("/")
        target_dir = self._root / dossier if dossier else self._root
        target_dir.mkdir(parents=True, exist_ok=True)
        ext = ""
        if "." in filename:
            ext = "." + filename.rsplit(".", 1)[-1]
        cle = f"{uuid.uuid4().hex}{ext}"
        if dossier:
            cle = f"{dossier}/{cle}"
        path = self._root / cle
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(contenu)
        return UploadResult(
            url=f"{self._base_url}/uploads/{cle}",
            public_id=cle,
            format=ext.lstrip(".") if ext else None,
            taille_octets=len(contenu),
        )

    def delete(self, public_id: str) -> bool:
        path = self._root / public_id
        try:
            if path.exists():
                path.unlink()
                return True
        except OSError:
            return False
        return False