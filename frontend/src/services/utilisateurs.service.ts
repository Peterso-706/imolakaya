// frontend/src/services/utilisateurs.service.ts
import { fetchApi, buildQuery } from "./api";
import { UtilisateurRead, UtilisateurCreate, UtilisateurAdminUpdate } from "@/types/utilisateur";
import { PaginatedResponse } from "@/types/api";

export const utilisateursService = {
  // GET /api/v1/admin/utilisateurs
  lister: async (page = 1, taille = 20): Promise<PaginatedResponse<UtilisateurRead>> => {
    const query = buildQuery({ page, taille });
    return fetchApi<PaginatedResponse<UtilisateurRead>>(`/admin/utilisateurs${query}`);
  },

  // POST /api/v1/admin/utilisateurs
  creer: async (payload: UtilisateurCreate, roles: string[] = []): Promise<UtilisateurRead> => {
    const query = roles.length > 0 ? `?roles=${roles.join(",")}` : "";
    return fetchApi<UtilisateurRead>(`/admin/utilisateurs${query}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // PATCH /api/v1/admin/utilisateurs/{user_id}
  modifier: async (userId: string, payload: UtilisateurAdminUpdate): Promise<UtilisateurRead> => {
    return fetchApi<UtilisateurRead>(`/admin/utilisateurs/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};