from uuid import uuid4

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from app.core.config import get_settings
from app.integrations.storage.base import StorageProvider, UploadResult


class R2Provider(StorageProvider):
    def __init__(self) -> None:
        settings = get_settings()
        if not all([settings.r2_account_id, settings.r2_access_key_id,
                    settings.r2_secret_access_key, settings.r2_bucket]):
            raise RuntimeError("R2 mal configuré")
        self._bucket = settings.r2_bucket
        self._public_url = settings.r2_public_url or ""
        self._client = boto3.client(
            "s3",
            endpoint_url=f"https://{settings.r2_account_id}.r2.cloudflarestorage.com",
            aws_access_key_id=settings.r2_access_key_id,
            aws_secret_access_key=settings.r2_secret_access_key,
            region_name="auto",
        )

    def upload(
        self, contenu: bytes, *, filename: str, content_type: str, dossier: str = ""
    ) -> UploadResult:
        cle = f"{dossier.strip('/')}/{uuid4().hex}-{filename}".lstrip("/")
        try:
            self._client.put_object(
                Bucket=self._bucket, Key=cle,
                Body=contenu, ContentType=content_type,
            )
        except (BotoCoreError, ClientError) as exc:
            raise RuntimeError(f"Échec upload R2 : {exc}") from exc
        return UploadResult(
            url=f"{self._public_url.rstrip('/')}/{cle}",
            public_id=cle,
            format=filename.rsplit(".", 1)[-1] if "." in filename else None,
            taille_octets=len(contenu),
        )

    def delete(self, public_id: str) -> bool:
        try:
            self._client.delete_object(Bucket=self._bucket, Key=public_id)
            return True
        except (BotoCoreError, ClientError):
            return False