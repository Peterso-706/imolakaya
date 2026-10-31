// frontend/src/types/annonce.ts
import { StatutAnnonce } from "./enums";

export interface AnnonceBase {
  titre: string;
  description: string;
}

export interface AnnonceCreate extends AnnonceBase {
  bien_id: string;
}

export interface AnnonceUpdate {
  titre?: string;
  description?: string;
}

export interface AnnonceAdminUpdate {
  statut?: StatutAnnonce;
  motif_rejet?: string | null;
}

export interface AnnonceRead extends AnnonceBase {
  id: string;
  bien_id: string;
  statut: StatutAnnonce;
  date_soumission?: string | null;
  date_validation?: string | null;
  date_publication?: string | null;
  date_expiration?: string | null;
  motif_rejet?: string | null;
  cree_le: string;
}

export interface AnnonceSoumettreRequest {} // Pa gen okenn chan

export interface AnnonceApprouverRequest {
  date_expiration?: string | null;
}

export interface AnnonceRejeterRequest {
  motif: string;
}