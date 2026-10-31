import uuid

from app.core.config import get_settings
from app.database.session import SessionLocal
from app.integrations.storage.base import StorageProvider, UploadResult
from app.models.media import MediaFile


class DbProvider(StorageProvider):
    def __init__(self) -> None:
        settings = get_settings()
        self._base_url = settings.media_base_url.rstrip("/")

    def upload(self, contenu: bytes, *, filename: str, content_type: str, dossier: str = "") -> UploadResult:
        dossier = (dossier or "").strip("/")
        ext = ""
        if "." in filename:
            ext = "." + filename.rsplit(".", 1)[-1]
        cle = f"{dossier}/{uuid.uuid4().hex}{ext}".lstrip("/")
        db = SessionLocal()
        try:
            mf = MediaFile(cle=cle, content_type=content_type, contenu=contenu, taille_octets=len(contenu))
            db.add(mf)
            db.commit()
        finally:
            db.close()
        return UploadResult(
            url=f"{self._base_url}/media-files/{cle}",
            public_id=cle,
            format=ext.lstrip(".") if ext else None,
            taille_octets=len(contenu),
        )

    def delete(self, public_id: str) -> bool:
        db = SessionLocal()
        try:
            mf = db.query(MediaFile).filter(MediaFile.cle == public_id).first()
            if mf:
                db.delete(mf)
                db.commit()
                return True
            return False
        finally:
            db.close()