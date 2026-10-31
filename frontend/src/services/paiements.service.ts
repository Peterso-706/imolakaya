// frontend/src/services/paiements.service.ts
import { fetchApi, buildQuery } from "./api";
import { PaiementCreateEnLigne, PaiementRead } from "@/types/paiement";
import { PaginatedResponse } from "@/types/api";
import { PaiementReadDetail, PaiementConfirmerManuelRequest } from "@/types/paiement";

export const paiementsService = {
  lister: async (page = 1, taille = 20): Promise<PaginatedResponse<PaiementRead>> => {
    const query = buildQuery({ page, taille });
    return fetchApi<PaginatedResponse<PaiementRead>>(`/proprietaire/paiements${query}`);
  },

  creer: async (payload: PaiementCreateEnLigne): Promise<PaiementRead> => {
    return fetchApi<PaiementRead>("/proprietaire/paiements", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },


  // --- ADMIN ---
  listerAdmin: async (page = 1, taille = 20): Promise<PaginatedResponse<PaiementRead>> => {
    const query = buildQuery({ page, taille });
    return fetchApi<PaginatedResponse<PaiementRead>>(`/admin/paiements${query}`);
  },

  confirmer: async (paiementId: string, payload: PaiementConfirmerManuelRequest): Promise<PaiementReadDetail> => {
    return fetchApi<PaiementReadDetail>(`/admin/paiements/${paiementId}/confirmer`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};