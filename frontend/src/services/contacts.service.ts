// frontend/src/services/contacts.service.ts
import { fetchApi, buildQuery } from "./api";
import { ContactRead, ContactCreatePublic } from "@/types/interaction";
import { PaginatedResponse, IdResponse } from "@/types/api";

export const contactsService = {
  // --- PUBLIC ---
  // POST /api/v1/public/contacts
  creerPublic: async (payload: ContactCreatePublic): Promise<IdResponse> => {
    return fetchApi<IdResponse>("/public/contacts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // --- PROPRIÉTAIRE ---
  // GET /api/v1/proprietaire/contacts
  lister: async (page = 1, taille = 20): Promise<PaginatedResponse<ContactRead>> => {
    const query = buildQuery({ page, taille });
    return fetchApi<PaginatedResponse<ContactRead>>(`/proprietaire/contacts${query}`);
  },
};