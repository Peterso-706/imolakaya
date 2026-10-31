// frontend/src/services/avis.service.ts
import { fetchApi } from "./api";
import { AvisCreate } from "@/types/interaction";
import { IdResponse } from "@/types/api";

export const avisService = {
  // POST /api/v1/public/avis
  creer: async (payload: AvisCreate): Promise<IdResponse> => {
    return fetchApi<IdResponse>("/public/avis", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};