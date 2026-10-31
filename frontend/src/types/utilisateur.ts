// frontend/src/types/utilisateur.ts

export interface RoleRef {
  id: string; // UUID
  nom: string;
}

export interface UtilisateurBase {
  email: string;
  nom: string;
  prenom?: string | null;
  telephone?: string | null;
}

export interface UtilisateurCreate extends UtilisateurBase {
  mot_de_passe: string;
}

export interface UtilisateurUpdate {
  nom?: string;
  prenom?: string | null;
  telephone?: string | null;
}

export interface UtilisateurAdminUpdate extends UtilisateurUpdate {
  est_actif?: boolean;
  est_verifie?: boolean;
}

export interface UtilisateurRead extends UtilisateurBase {
  id: string; // UUID
  est_actif: boolean;
  est_verifie: boolean;
  derniere_connexion?: string | null; // Datetime konvèti an string
  cree_le: string; // Datetime konvèti an string
}

export interface UtilisateurReadDetail extends UtilisateurRead {
  roles: RoleRef[];
}