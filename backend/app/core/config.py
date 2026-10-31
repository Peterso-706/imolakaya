from functools import lru_cache
from typing import Annotated, Literal

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # --- Application ---
    app_name: str = "ImoLakaya API"
    app_version: str = "1.0.0"
    environment: Literal["development", "preproduction", "production"] = "development"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    # --- Base de données ---
    database_url: str
    database_echo: bool = False

    # --- Sécurité ---
    secret_key: str = Field(min_length=32)
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # --- CORS ---
    cors_origins: Annotated[list[str], NoDecode] = Field(default_factory=list)

    # --- Stockage ---
    storage_provider: Literal["cloudinary", "r2"] | None = None
    cloudinary_url: str | None = None
    cloudinary_folder: str = "imolakaya"

    # --- R2 ---
    r2_account_id: str | None = None
    r2_access_key_id: str | None = None
    r2_secret_access_key: str | None = None
    r2_bucket: str = "imolakaya"
    r2_public_url: str | None = None

    # --- Paiement ---
    moncash_api_url: str | None = None
    moncash_client_id: str | None = None
    moncash_client_secret: str | None = None
    natcash_api_url: str | None = None
    natcash_api_key: str | None = None

    # --- Webhooks ---
    moncash_webhook_secret: str | None = None
    natcash_webhook_secret: str | None = None

    # --- Email ---
    resend_api_key: str | None = None
    email_from: str = "noreply@imolakaya.com"
    email_enabled: bool = False

    # --- Rate limit ---
    rate_limit_per_minute: int = 60

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_cors(cls, v):
        if isinstance(v, str):
            return [x.strip() for x in v.split(",") if x.strip()]
        return v

    @field_validator("database_url", mode="before")
    @classmethod
    def _normalize_db_url(cls, v):
        if isinstance(v, str):
            if v.startswith("postgres://"):
                v = v.replace("postgres://", "postgresql+psycopg://", 1)
            elif v.startswith("postgresql://") and "+psycopg" not in v:
                v = v.replace("postgresql://", "postgresql+psycopg://", 1)
        return v
    @model_validator(mode="after")
    def _validate_environment(self):
        allowed = {"development", "staging", "production"}
        if self.environment not in allowed:
            raise ValueError("ENVIRONMENT invalide")
        if self.environment == "production":
            if self.debug:
                raise ValueError("DEBUG doit être False en production")
            if len(self.secret_key) < 32 or self.secret_key.startswith("change_me"):
                raise ValueError("SECRET_KEY faible/placeholder en production")
        return self


    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def is_development(self) -> bool:
        return self.environment == "development"


@lru_cache
def get_settings() -> Settings:
    return Settings()