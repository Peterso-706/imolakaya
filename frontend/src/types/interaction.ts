// frontend/src/types/interaction.ts
import { SourceVisite, StatutAvis, StatutContact, TypeNotification } from "./enums";

// --- Contact ---
export interface ContactCreatePublic {
  bien_id: string;
  nom_visiteur: string;
  email_visiteur: string;
  telephone_visiteur?: string | null;
  message: string;
}

export interface ContactUpdateProprietaire {
  statut?: StatutContact;
  date_lecture?: string | null;
  date_traitement?: string | null;
}

export interface ContactRead {
  id: string;
  bien_id: string;
  proprietaire_id: string;
  utilisateur_id?: string | null;
  nom_visiteur: string;
  email_visiteur: string;
  telephone_visiteur?: string | null;
  message: string;
  statut: StatutContact;
  date_lecture?: string | null;
  date_traitement?: string | null;
  cree_le: string;
}

// --- Visite ---
export interface VisiteCreate {
  bien_id: string;
  source?: SourceVisite;
  adresse_ip?: string | null;
  user_agent?: string | null;
}

export interface VisiteRead {
  id: string;
  bien_id: string;
  utilisateur_id?: string | null;
  source: SourceVisite;
  pays?: string | null;
  ville?: string | null;
  cree_le: string;
}

export interface VisiteStats {
  bien_id: string;
  total_visites: number;
  visites_7_jours: number;
  visites_30_jours: number;
}

// --- Avis ---
export interface AvisCreate {
  bien_id: string;
  note: number; // 1 a 5
  commentaire: string;
  nom_auteur?: string | null;
}

export interface AvisModerationRequest {
  statut: StatutAvis;
  motif_rejet?: string | null;
}

export interface AvisRead {
  id: string;
  bien_id: string;
  utilisateur_id?: string | null;
  nom_auteur?: string | null;
  note: number;
  commentaire: string;
  statut: StatutAvis;
  date_moderation?: string | null;
  motif_rejet?: string | null;
  cree_le: string;
}

// --- Notification ---
export interface NotificationCreate {
  utilisateur_id: string;
  type: TypeNotification;
  titre: string;
  message: string;
  lien?: string | null;
}

export interface NotificationRead {
  id: string;
  utilisateur_id: string;
  type: TypeNotification;
  titre: string;
  message: string;
  lien?: string | null;
  est_lue: boolean;
  date_lecture?: string | null;
  cree_le: string;
}

// --- Favori ---
export interface FavoriCreate {
  bien_id: string;
}

export interface FavoriRead {
  id: string;
  utilisateur_id: string;
  bien_id: string;
  cree_le: string;
}