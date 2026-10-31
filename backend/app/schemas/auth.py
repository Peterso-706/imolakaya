from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    mot_de_passe: str = Field(min_length=8, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expire_dans: int


class RegisterProprietaireRequest(BaseModel):
    email: EmailStr
    mot_de_passe: str = Field(min_length=8, max_length=128)
    nom: str = Field(min_length=1, max_length=120)
    prenom: str | None = Field(default=None, max_length=120)
    telephone: str | None = Field(default=None, max_length=30)


class TokenPayload(BaseModel):
    sub: UUID
    roles: list[str] = []
    permissions: list[str] = []
    exp: int


class ChangePasswordRequest(BaseModel):
    ancien_mot_de_passe: str = Field(min_length=8, max_length=128)
    nouveau_mot_de_passe: str = Field(min_length=8, max_length=128)