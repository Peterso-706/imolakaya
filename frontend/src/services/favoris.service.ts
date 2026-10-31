// frontend/src/services/favoris.service.ts
import { fetchApi } from "./api";
import { FavoriCreate, FavoriRead } from "@/types/interaction";
import { IdResponse, MessageResponse } from "@/types/api";

export const favorisService = {
  lister: async (): Promise<FavoriRead[]> => {
    return fetchApi<FavoriRead[]>("/proprietaire/favoris");
  },

  ajouter: async (payload: FavoriCreate): Promise<IdResponse> => {
    return fetchApi<IdResponse>("/proprietaire/favoris", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  retirer: async (bienId: string): Promise<MessageResponse> => {
    return fetchApi<MessageResponse>(`/proprietaire/favoris/${bienId}`, {
      method: "DELETE",
    });
  },
};