class Permissions:
    # Utilisateurs
    UTILISATEUR_LIRE = "utilisateur:lire"
    UTILISATEUR_CREER = "utilisateur:creer"
    UTILISATEUR_MODIFIER = "utilisateur:modifier"
    UTILISATEUR_SUPPRIMER = "utilisateur:supprimer"

    # Rôles
    ROLE_GERER = "role:gerer"

    # Biens
    BIEN_LIRE = "bien:lire"
    BIEN_CREER = "bien:creer"
    BIEN_MODIFIER = "bien:modifier"
    BIEN_SUPPRIMER = "bien:supprimer"
    BIEN_VALIDER = "bien:valider"

    # Annonces
    ANNONCE_CREER = "annonce:creer"
    ANNONCE_SOUMETTRE = "annonce:soumettre"
    ANNONCE_APPROUVER = "annonce:approuver"
    ANNONCE_REJETER = "annonce:rejeter"

    # Médias
    MEDIA_AJOUTER = "media:ajouter"
    MEDIA_SUPPRIMER = "media:supprimer"

    # Paiements
    PAIEMENT_LIRE = "paiement:lire"
    PAIEMENT_CREER = "paiement:creer"
    PAIEMENT_AGENCE = "paiement:agence"
    PAIEMENT_CONFIRMER = "paiement:confirmer"
    PAIEMENT_REMBOURSER = "paiement:rembourser"

    # Agences
    AGENCE_GERER = "agence:gerer"
    EMPLOYE_GERER = "employe:gerer"

    # Interactions
    CONTACT_LIRE = "contact:lire"
    CONTACT_TRAITER = "contact:traiter"
    VISITE_LIRE = "visite:lire"
    AVIS_MODERER = "avis:moderer"
    NOTIFICATION_LIRE = "notification:lire"

    # Rapports & audit
    RAPPORT_LIRE = "rapport:lire"
    AUDIT_LIRE = "audit:lire"
    PARAMETRE_GERER = "parametre:gerer"


class Roles:
    ADMIN_PRINCIPAL = "admin_principal"
    ADMIN = "admin"
    EMPLOYE = "employe"
    PROPRIETAIRE = "proprietaire"
    VISITEUR = "visiteur"


ROLE_PERMISSIONS: dict[str, list[str]] = {
    Roles.ADMIN_PRINCIPAL: ["*"],
    Roles.ADMIN: [
        Permissions.UTILISATEUR_LIRE, Permissions.UTILISATEUR_CREER,
        Permissions.UTILISATEUR_MODIFIER, Permissions.UTILISATEUR_SUPPRIMER,
        Permissions.BIEN_LIRE, Permissions.BIEN_MODIFIER,
        Permissions.BIEN_VALIDER, Permissions.BIEN_SUPPRIMER,
        Permissions.ANNONCE_APPROUVER, Permissions.ANNONCE_REJETER,
        Permissions.PAIEMENT_LIRE, Permissions.PAIEMENT_CONFIRMER,
        Permissions.PAIEMENT_REMBOURSER,
        Permissions.AGENCE_GERER, Permissions.EMPLOYE_GERER,
        Permissions.CONTACT_LIRE, Permissions.VISITE_LIRE,
        Permissions.AVIS_MODERER, Permissions.RAPPORT_LIRE,
        Permissions.AUDIT_LIRE, Permissions.PARAMETRE_GERER,
    ],
    Roles.EMPLOYE: [
        Permissions.BIEN_LIRE, Permissions.BIEN_CREER, Permissions.BIEN_MODIFIER,
        Permissions.MEDIA_AJOUTER, Permissions.MEDIA_SUPPRIMER,
        Permissions.ANNONCE_CREER, Permissions.ANNONCE_SOUMETTRE,
        Permissions.PAIEMENT_CREER, Permissions.PAIEMENT_AGENCE,
        Permissions.PAIEMENT_LIRE, Permissions.CONTACT_LIRE,
    ],
    Roles.PROPRIETAIRE: [
        Permissions.BIEN_LIRE, Permissions.BIEN_CREER, Permissions.BIEN_MODIFIER,
        Permissions.MEDIA_AJOUTER, Permissions.MEDIA_SUPPRIMER,
        Permissions.ANNONCE_CREER, Permissions.ANNONCE_SOUMETTRE,
        Permissions.PAIEMENT_LIRE, Permissions.PAIEMENT_CREER,
        Permissions.CONTACT_LIRE, Permissions.NOTIFICATION_LIRE,
    ],
    Roles.VISITEUR: [],
}