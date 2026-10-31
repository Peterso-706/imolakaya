// frontend/src/types/auth.ts

export interface LoginRequest {
  email: string;
  mot_de_passe: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expire_dans: number;
}

export interface RegisterProprietaireRequest {
  email: string;
  mot_de_passe: string;
  nom: string;
  prenom?: string | null;
  telephone?: string | null;
}

export interface ChangePasswordRequest {
  ancien_mot_de_passe: string;
  nouveau_mot_de_passe: string;
}