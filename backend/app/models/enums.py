from enum import Enum


class TypeOperation(str, Enum):
    VENTE = "vente"
    LOCATION = "location"


class TypeLocation(str, Enum):
    LOGEMENT_ENTIER = "logement_entier"
    APPARTEMENT = "appartement"
    CHAMBRE = "chambre"


class StatutBien(str, Enum):
    DISPONIBLE = "disponible"
    RESERVE = "reserve"
    LOUE = "loue"
    VENDU = "vendu"
    RETIRE = "retire"


class StatutAnnonce(str, Enum):
    BROUILLON = "brouillon"
    EN_ATTENTE = "en_attente"
    APPROUVEE = "approuvee"
    REJETEE = "rejetee"
    PUBLIEE = "publiee"
    EXPIREE = "expiree"


class TypeMedia(str, Enum):
    PHOTO = "photo"
    VIDEO = "video"


class Devise(str, Enum):
    HTG = "HTG"
    USD = "USD"


class FrequencePaiement(str, Enum):
    MENSUEL = "mensuel"
    TRIMESTRIEL = "trimestriel"
    SEMESTRIEL = "semestriel"
    ANNUEL = "annuel"

class SourcePaiement(str, Enum):
    EN_LIGNE = "en_ligne"
    AGENCE = "agence"


class MethodePaiement(str, Enum):
    MONCASH = "moncash"
    NATCASH = "natcash"
    CARTE_BANCAIRE = "carte_bancaire"
    AGENCE_ESPECES = "agence_especes"
    AGENCE_CHEQUE = "agence_cheque"
    AGENCE_VIREMENT = "agence_virement"


class StatutPaiement(str, Enum):
    EN_ATTENTE = "en_attente"
    CONFIRME = "confirme"
    ECHOUE = "echoue"
    ANNULE = "annule"
    REMBOURSE = "rembourse"
    LITIGE = "litige"


class TypeTransaction(str, Enum):
    CREATION = "creation"
    NOTIFICATION_RECUE = "notification_recue"
    CONFIRMATION = "confirmation"
    ECHEC = "echec"
    ANNULATION = "annulation"
    REMBOURSEMENT = "remboursement"
    VERIFICATION_MANUELLE = "verification_manuelle"

class StatutContact(str, Enum):
    NOUVEAU = "nouveau"
    LU = "lu"
    TRAITE = "traite"
    ARCHIVE = "archive"


class StatutAvis(str, Enum):
    EN_ATTENTE = "en_attente"
    APPROUVE = "approuve"
    REJETE = "rejete"


class SourceVisite(str, Enum):
    PUBLIC = "public"
    PROPRIETAIRE = "proprietaire"
    ADMIN = "admin"
    API = "api"


class TypeNotification(str, Enum):
    CONTACT_RECU = "contact_recu"
    ANNONCE_SOUMISE = "annonce_soumise"
    ANNONCE_APPROUVEE = "annonce_approuvee"
    ANNONCE_REJETEE = "annonce_rejetee"
    ANNONCE_PUBLIEE = "annonce_publiee"
    ANNONCE_EXPIREE = "annonce_expiree"
    PAIEMENT_CONFIRME = "paiement_confirme"
    PAIEMENT_ECHOUE = "paiement_echoue"
    SYSTEME = "systeme"
    AUTRE = "autre"