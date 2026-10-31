// frontend/src/services/notifications.service.ts
import { fetchApi, buildQuery } from "./api";
import { NotificationRead } from "@/types/interaction";
import { PaginatedResponse } from "@/types/api";

export const notificationsService = {
  lister: async (page = 1, taille = 20): Promise<PaginatedResponse<NotificationRead>> => {
    const query = buildQuery({ page, taille });
    return fetchApi<PaginatedResponse<NotificationRead>>(`/proprietaire/notifications${query}`);
  },

  marquerLue: async (notifId: string): Promise<NotificationRead> => {
    return fetchApi<NotificationRead>(`/proprietaire/notifications/${notifId}/lue`, {
      method: "POST",
    });
  },
};