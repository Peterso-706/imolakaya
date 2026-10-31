// frontend/src/services/referentiels.service.ts
import { fetchApi, buildQuery } from "./api";
import { CategorieRead, LocalisationRead } from "@/types/bien";

// --- Types pour l'admin ---
export interface CategorieCreatePayload {
  nom: string;
  slug: string;
  description?: string | null;
  icone?: string | null;
  ordre: number;
}

export interface CategorieUpdatePayload {
  nom?: string;
  description?: string | null;
  icone?: string | null;
  ordre?: number;
  est_active?: boolean;
}

export interface LocalisationCreatePayload {
  departement: string;
  commune: string;
  zone: string;
  adresse_descriptive?: string | null;
}

export const referentielsService = {
  // --- PUBLIC ---
  // GET /api/v1/public/categories
  listerCategoriesPubliques: async (): Promise<CategorieRead[]> => {
    return fetchApi<CategorieRead[]>("/public/categories");
  },

  // GET /api/v1/public/localisations?departement=...
  listerLocalisationsPubliques: async (departement?: string): Promise<LocalisationRead[]> => {
    const query = buildQuery({ departement });
    return fetchApi<LocalisationRead[]>(`/public/localisations${query}`);
  },

  // --- ADMIN ---
  creerCategorie: async (payload: CategorieCreatePayload): Promise<CategorieRead> => {
    return fetchApi<CategorieRead>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  modifierCategorie: async (catId: string, payload: CategorieUpdatePayload): Promise<CategorieRead> => {
    return fetchApi<CategorieRead>(`/admin/categories/${catId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  listerLocalisationsAdmin: async (): Promise<LocalisationRead[]> => {
    return fetchApi<LocalisationRead[]>("/admin/localisations");
  },

  creerLocalisation: async (payload: LocalisationCreatePayload): Promise<LocalisationRead> => {
    return fetchApi<LocalisationRead>("/admin/localisations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};