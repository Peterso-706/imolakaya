from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class UploadResult:
    url: str
    public_id: str
    format: str | None = None
    taille_octets: int | None = None
    largeur: int | None = None
    hauteur: int | None = None
    duree_secondes: int | None = None


class StorageProvider(ABC):
    @abstractmethod
    def upload(
        self, contenu: bytes, *, filename: str, content_type: str, dossier: str = ""
    ) -> UploadResult: ...

    @abstractmethod
    def delete(self, public_id: str) -> bool: ...