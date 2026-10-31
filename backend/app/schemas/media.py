from datetime import datetime
from uuid import UUID

from pydantic import Field

from app.models.enums import TypeMedia
from app.schemas.common import ORMModel


class MediaCreate(ORMModel):
    url: str = Field(max_length=1000)
    public_id: str | None = Field(default=None, max_length=255)
    type: TypeMedia
    ordre: int = 0
    est_couverture: bool = False
    titre: str | None = Field(default=None, max_length=200)


class MediaUpdate(ORMModel):
    ordre: int | None = None
    est_couverture: bool | None = None
    titre: str | None = Field(default=None, max_length=200)


class MediaRead(ORMModel):
    id: UUID
    bien_id: UUID
    url: str
    type: TypeMedia
    ordre: int
    est_couverture: bool
    titre: str | None = None
    format: str | None = None
    taille_octets: int | None = None
    largeur: int | None = None
    hauteur: int | None = None
    cree_le: datetime


class MediaReorderItem(ORMModel):
    id: UUID
    ordre: int


class MediaReorderRequest(ORMModel):
    items: list[MediaReorderItem]