// frontend/src/services/annonces.service.ts
import { fetchApi, buildQuery } from "./api";
import { AnnonceCreate, AnnonceRead, AnnonceUpdate } from "@/types/annonce";
import { PaginatedResponse } from "@/types/api";
import { AnnonceApprouverRequest, AnnonceRejeterRequest } from "@/types/annonce";

export const annoncesService = {
  lister: async (page = 1, taille = 20): Promise<PaginatedResponse<AnnonceRead>> => {
    const query = buildQuery({ page, taille });
    return fetchApi<PaginatedResponse<AnnonceRead>>(`/proprietaire/annonces${query}`);
  },

  creer: async (payload: AnnonceCreate): Promise<AnnonceRead> => {
    return fetchApi<AnnonceRead>("/proprietaire/annonces", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  modifier: async (annonceId: string, payload: AnnonceUpdate): Promise<AnnonceRead> => {
    return fetchApi<AnnonceRead>(`/proprietaire/annonces/${annonceId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  soumettre: async (annonceId: string): Promise<AnnonceRead> => {
    return fetchApi<AnnonceRead>(`/proprietaire/annonces/${annonceId}/soumettre`, {
      method: "POST",
    });
  },



  // --- ADMIN ---
  listerAdmin: async (page = 1, taille = 20): Promise<PaginatedResponse<AnnonceRead>> => {
    const query = buildQuery({ page, taille });
    return fetchApi<PaginatedResponse<AnnonceRead>>(`/admin/annonces${query}`);
  },

  approuver: async (annonceId: string, payload: AnnonceApprouverRequest): Promise<AnnonceRead> => {
    return fetchApi<AnnonceRead>(`/admin/annonces/${annonceId}/approuver`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  rejeter: async (annonceId: string, payload: AnnonceRejeterRequest): Promise<AnnonceRead> => {
    return fetchApi<AnnonceRead>(`/admin/annonces/${annonceId}/rejeter`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  publier: async (annonceId: string): Promise<AnnonceRead> => {
    return fetchApi<AnnonceRead>(`/admin/annonces/${annonceId}/publier`, {
      method: "POST",
    });
  },
};