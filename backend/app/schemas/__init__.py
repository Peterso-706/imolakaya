from app.schemas.common import (
    IdResponse,
    MessageResponse,
    ORMModel,
    PaginatedResponse,
    PaginationParams,
)
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    RegisterProprietaireRequest,
    TokenPayload,
    TokenResponse,
)
from app.schemas.utilisateur import (
    RoleRef,
    UtilisateurAdminUpdate,
    UtilisateurCreate,
    UtilisateurRead,
    UtilisateurReadDetail,
    UtilisateurUpdate,
)
from app.schemas.role import PermissionRef, RoleCreate, RoleRead, RoleUpdate
from app.schemas.agence import (
    AgenceCreate,
    AgenceRead,
    AgenceUpdate,
    EmployeCreate,
    EmployeRead,
    EmployeUpdate,
    ProprietaireCreate,
    ProprietaireRead,
    ProprietaireUpdate,
)
from app.schemas.bien import (
    BienCreate,
    BienRead,
    BienReadDetail,
    BienSearchParams,
    BienUpdate,
    CategorieCreate,
    CategorieRead,
    CategorieUpdate,
    LocalisationCreate,
    LocalisationRead,
)
from app.schemas.media import MediaCreate, MediaRead, MediaReorderRequest, MediaUpdate
from app.schemas.annonce import (
    AnnonceAdminUpdate,
    AnnonceApprouverRequest,
    AnnonceCreate,
    AnnonceRead,
    AnnonceRejeterRequest,
    AnnonceSoumettreRequest,
    AnnonceUpdate,
)
from app.schemas.paiement import (
    PaiementConfirmerManuelRequest,
    PaiementCreateAgence,
    PaiementCreateEnLigne,
    PaiementRead,
    PaiementReadDetail,
)
from app.schemas.transaction import TransactionRead
from app.schemas.interaction import (
    AvisCreate,
    AvisModerationRequest,
    AvisRead,
    ContactCreatePublic,
    ContactRead,
    ContactUpdateProprietaire,
    FavoriCreate,
    FavoriRead,
    NotificationCreate,
    NotificationRead,
    VisiteCreate,
    VisiteRead,
    VisiteStats,
)
from app.schemas.audit import AuditLogRead

__all__ = [
    # common
    "ORMModel", "PaginationParams", "PaginatedResponse",
    "MessageResponse", "IdResponse",
    # auth
    "LoginRequest", "TokenResponse", "TokenPayload",
    "RegisterProprietaireRequest", "ChangePasswordRequest",
    # utilisateur
    "UtilisateurCreate", "UtilisateurUpdate", "UtilisateurAdminUpdate",
    "UtilisateurRead", "UtilisateurReadDetail", "RoleRef",
    # role
    "RoleCreate", "RoleUpdate", "RoleRead", "PermissionRef",
    # agence
    "AgenceCreate", "AgenceUpdate", "AgenceRead",
    "ProprietaireCreate", "ProprietaireUpdate", "ProprietaireRead",
    "EmployeCreate", "EmployeUpdate", "EmployeRead",
    # bien
    "CategorieCreate", "CategorieUpdate", "CategorieRead",
    "LocalisationCreate", "LocalisationRead",
    "BienCreate", "BienUpdate", "BienRead", "BienReadDetail",
    "BienSearchParams",
    # media
    "MediaCreate", "MediaUpdate", "MediaRead", "MediaReorderRequest",
    # annonce
    "AnnonceCreate", "AnnonceUpdate", "AnnonceAdminUpdate",
    "AnnonceRead", "AnnonceSoumettreRequest",
    "AnnonceApprouverRequest", "AnnonceRejeterRequest",
    # paiement
    "PaiementCreateEnLigne", "PaiementCreateAgence",
    "PaiementRead", "PaiementReadDetail",
    "PaiementConfirmerManuelRequest",
    # transaction
    "TransactionRead",
    # interaction
    "ContactCreatePublic", "ContactUpdateProprietaire", "ContactRead",
    "VisiteCreate", "VisiteRead", "VisiteStats",
    "AvisCreate", "AvisModerationRequest", "AvisRead",
    "NotificationCreate", "NotificationRead",
    "FavoriCreate", "FavoriRead",
    # audit
    "AuditLogRead",
]