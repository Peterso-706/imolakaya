// frontend/src/services/visites.service.ts
import { fetchApi } from "./api";
import { VisiteCreate } from "@/types/interaction";
import { IdResponse } from "@/types/api";

export const visitesService = {
  // POST /api/v1/public/visites
  enregistrer: async (payload: VisiteCreate): Promise<IdResponse | null> => {
    return fetchApi<IdResponse | null>("/public/visites", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};