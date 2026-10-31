// frontend/src/utils/constants.ts

export const Permissions = {
  UTILISATEUR_LIRE: "utilisateur:lire",
  UTILISATEUR_CREER: "utilisateur:creer",
  UTILISATEUR_MODIFIER: "utilisateur:modifier",
  UTILISATEUR_SUPPRIMER: "utilisateur:supprimer",

  ROLE_GERER: "role:gerer",

  BIEN_LIRE: "bien:lire",
  BIEN_CREER: "bien:creer",
  BIEN_MODIFIER: "bien:modifier",
  BIEN_SUPPRIMER: "bien:supprimer",
  BIEN_VALIDER: "bien:valider",

  ANNONCE_CREER: "annonce:creer",
  ANNONCE_SOUMETTRE: "annonce:soumettre",
  ANNONCE_APPROUVER: "annonce:approuver",
  ANNONCE_REJETER: "annonce:rejeter",

  MEDIA_AJOUTER: "media:ajouter",
  MEDIA_SUPPRIMER: "media:supprimer",

  PAIEMENT_LIRE: "paiement:lire",
  PAIEMENT_CREER: "paiement:creer",
  PAIEMENT_AGENCE: "paiement:agence",
  PAIEMENT_CONFIRMER: "paiement:confirmer",
  PAIEMENT_REMBOURSER: "paiement:rembourser",

  AGENCE_GERER: "agence:gerer",
  EMPLOYE_GERER: "employe:gerer",

  CONTACT_LIRE: "contact:lire",
  CONTACT_TRAITER: "contact:traiter",
  VISITE_LIRE: "visite:lire",
  AVIS_MODERER: "avis:moderer",
  NOTIFICATION_LIRE: "notification:lire",

  RAPPORT_LIRE: "rapport:lire",
  AUDIT_LIRE: "audit:lire",
  PARAMETRE_GERER: "parametre:gerer",
} as const;

export const Roles = {
  ADMIN_PRINCIPAL: "admin_principal",
  ADMIN: "admin",
  EMPLOYE: "employe",
  PROPRIETAIRE: "proprietaire",
  VISITEUR: "visiteur",
} as const;