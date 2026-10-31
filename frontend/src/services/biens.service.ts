// frontend/src/services/biens.service.ts
import { fetchApi, buildQuery } from "./api";
import { BienReadDetail, BienSearchParams, BienRead, BienCreate, BienUpdate } from "@/types/bien";
import { PaginatedResponse, MessageResponse } from "@/types/api";
import { VisiteStats } from "@/types/interaction";

export const biensService = {
  // --- PUBLIC ---
  rechercher: async (params: BienSearchParams = {}): Promise<PaginatedResponse<BienReadDetail>> => {
    const query = buildQuery(params);
    return fetchApi<PaginatedResponse<BienReadDetail>>(`/public/biens${query}`);
  },

  getDetail: async (bienId: string): Promise<BienReadDetail> => {
    return fetchApi<BienReadDetail>(`/public/biens/${bienId}`);
  },

  getStatistiques: async (bienId: string): Promise<VisiteStats> => {
    return fetchApi<VisiteStats>(`/public/biens/${bienId}/statistiques`);
  },

  // --- PROPRIÉTAIRE ---
  listerMesBiens: async (page = 1, taille = 20): Promise<PaginatedResponse<BienRead>> => {
    const query = buildQuery({ page, taille });
    return fetchApi<PaginatedResponse<BienRead>>(`/proprietaire/biens${query}`);
  },

  creer: async (payload: BienCreate): Promise<BienRead> => {
    return fetchApi<BienRead>("/proprietaire/biens", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getMonBien: async (bienId: string): Promise<BienRead> => {
    return fetchApi<BienRead>(`/proprietaire/biens/${bienId}`);
  },

  modifier: async (bienId: string, payload: BienUpdate): Promise<BienRead> => {
    return fetchApi<BienRead>(`/proprietaire/biens/${bienId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  supprimer: async (bienId: string): Promise<MessageResponse> => {
    return fetchApi<MessageResponse>(`/proprietaire/biens/${bienId}`, {
      method: "DELETE",
    });
  },

    // GET /api/v1/admin/biens
  listerAdmin: async (page = 1, taille = 20): Promise<PaginatedResponse<BienRead>> => {
    const query = buildQuery({ page, taille });
    return fetchApi<PaginatedResponse<BienRead>>(`/admin/biens${query}`);
  },
};

