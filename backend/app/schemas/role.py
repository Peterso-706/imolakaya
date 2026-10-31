from uuid import UUID

from pydantic import Field

from app.schemas.common import ORMModel


class PermissionRef(ORMModel):
    id: UUID
    code: str
    description: str | None = None


class RoleBase(ORMModel):
    nom: str = Field(max_length=80)
    description: str | None = Field(default=None, max_length=255)


class RoleCreate(RoleBase):
    permissions_ids: list[UUID] = []


class RoleUpdate(ORMModel):
    nom: str | None = Field(default=None, max_length=80)
    description: str | None = Field(default=None, max_length=255)
    permissions_ids: list[UUID] | None = None


class RoleRead(RoleBase):
    id: UUID
    permissions: list[PermissionRef] = []