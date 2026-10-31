// frontend/src/services/auth.service.ts
import { fetchApi } from "./api";
import { 
  LoginRequest, 
  TokenResponse, 
  RegisterProprietaireRequest, 
  ChangePasswordRequest 
} from "@/types/auth";
import { UtilisateurRead } from "@/types/utilisateur";
import { MessageResponse } from "@/types/api";

export const authService = {
  // POST /api/v1/auth/login
  login: async (payload: LoginRequest): Promise<TokenResponse> => {
    return fetchApi<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // POST /api/v1/auth/inscription
  inscription: async (payload: RegisterProprietaireRequest): Promise<UtilisateurRead> => {
    return fetchApi<UtilisateurRead>("/auth/inscription", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // POST /api/v1/auth/changer-mot-de-passe
  changerMotDePasse: async (payload: ChangePasswordRequest): Promise<MessageResponse> => {
    return fetchApi<MessageResponse>("/auth/changer-mot-de-passe", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};