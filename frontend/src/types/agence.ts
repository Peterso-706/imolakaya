// frontend/src/types/agence.ts

// --- Agence ---
export interface AgenceBase {
  nom: string;
  adresse?: string | null;
  telephone?: string | null;
  email?: string | null;
}

export interface AgenceCreate extends AgenceBase {}

export interface AgenceUpdate {
  nom?: string;
  adresse?: string | null;
  telephone?: string | null;
  email?: string | null;
  est_active?: boolean;
}

export interface AgenceRead extends AgenceBase {
  id: string;
  est_active: boolean;
}

// --- Proprietaire ---
export interface ProprietaireCreate {
  utilisateur_id: string;
  adresse?: string | null;
  telephone_secondaire?: string | null;
  note_interne?: string | null;
}

export interface ProprietaireUpdate {
  adresse?: string | null;
  telephone_secondaire?: string | null;
  note_interne?: string | null;
}

export interface ProprietaireRead {
  id: string;
  utilisateur_id: string;
  adresse?: string | null;
  telephone_secondaire?: string | null;
}

// --- Employe ---
export interface EmployeCreate {
  utilisateur_id: string;
  agence_id: string;
  matricule?: string | null;
  poste?: string | null;
}

export interface EmployeUpdate {
  matricule?: string | null;
  poste?: string | null;
  est_actif?: boolean;
}

export interface EmployeRead {
  id: string;
  utilisateur_id: string;
  agence_id: string;
  matricule?: string | null;
  poste?: string | null;
  est_actif: boolean;
}