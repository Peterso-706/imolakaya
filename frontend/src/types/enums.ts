// frontend/src/types/enums.ts

export enum Devise {
  HTG = "HTG",
  USD = "USD",
  EUR = "EUR",
}

export enum TypeOperation {
  VENTE = "VENTE",
  LOCATION = "LOCATION",
}

export enum TypeLocation {
  MAISON = "MAISON",
  APPARTEMENT = "APPARTEMENT",
  CHAMBRE = "CHAMBRE",
  TERRAIN = "TERRAIN",
  LOCAL_COMMERCIAL = "LOCAL_COMMERCIAL",
}

export enum FrequencePaiement {
  MENSUEL = "MENSUEL",
  TRIMESTRIEL = "TRIMESTRIEL",
  SEMESTRIEL = "SEMESTRIEL",
  ANNUEL = "ANNUEL",
}

export enum StatutBien {
  DISPONIBLE = "DISPONIBLE",
  RESERVE = "RESERVE",
  LOUE = "LOUE",
  VENDU = "VENDU",
  RETIRE = "RETIRE",
}

export enum TypeMedia {
  PHOTO = "PHOTO",
  VIDEO = "VIDEO",
}

export enum StatutAnnonce {
  BROUILLON = "BROUILLON",
  EN_ATTENTE = "EN_ATTENTE",
  APPROUVEE = "APPROUVEE",
  REJETEE = "REJETEE",
  PUBLIEE = "PUBLIEE",
  EXPIREE = "EXPIREE",
}

export enum StatutContact {
  NOUVEAU = "NOUVEAU",
  LU = "LU",
  TRAITE = "TRAITE",
}

export enum SourceVisite {
  PUBLIC = "PUBLIC",
  PROPRIETAIRE = "PROPRIETAIRE",
}

export enum StatutAvis {
  EN_ATTENTE = "EN_ATTENTE",
  APPROUVE = "APPROUVE",
  REJETE = "REJETE",
}

export enum TypeNotification {
  SYSTEME = "SYSTEME",
  CONTACT = "CONTACT",
  PAIEMENT = "PAIEMENT",
  ANNONCE = "ANNONCE",
}

export enum MethodePaiement {
  MONCASH = "MONCASH",
  NATCASH = "NATCASH",
  CARTE_BANCAIRE = "CARTE_BANCAIRE",
  ESPECES = "ESPECES",
  VIREMENT = "VIREMENT",
}

export enum SourcePaiement {
  EN_LIGNE = "EN_LIGNE",
  AGENCE = "AGENCE",
}

export enum StatutPaiement {
  EN_ATTENTE = "EN_ATTENTE",
  CONFIRME = "CONFIRME",
  ECHOUE = "ECHOUE",
  ANNULE = "ANNULE",
}

export enum TypeTransaction {
  INITIALISATION = "INITIALISATION",
  CONFIRMATION = "CONFIRMATION",
  ECHEC = "ECHEC",
  REMBOURSEMENT = "REMBOURSEMENT",
}