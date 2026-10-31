// frontend/src/services/medias.service.ts
import { fetchApi } from "./api";
import { MediaCreate, MediaRead, MediaReorderRequest } from "@/types/media";
import { MessageResponse } from "@/types/api";

export const mediasService = {
  ajouter: async (bienId: string, payload: MediaCreate): Promise<MediaRead> => {
    return fetchApi<MediaRead>(`/proprietaire/biens/${bienId}/medias`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  reordonner: async (bienId: string, payload: MediaReorderRequest): Promise<MessageResponse> => {
    return fetchApi<MessageResponse>(`/proprietaire/biens/${bienId}/medias/reordonner`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  supprimer: async (mediaId: string): Promise<MessageResponse> => {
    return fetchApi<MessageResponse>(`/proprietaire/medias/${mediaId}`, {
      method: "DELETE",
    });
  },

  // Upload de fichier (FormData)
  uploader: async (bienId: string, fichier: File, estCouverture = false): Promise<MediaRead> => {
    const formData = new FormData();
    formData.append("fichier", fichier);
    formData.append("est_couverture", String(estCouverture));

    return fetchApi<MediaRead>(`/proprietaire/biens/${bienId}/medias/upload`, {
      method: "POST",
      body: formData,
    });
  },
};