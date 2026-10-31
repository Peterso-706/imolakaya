// frontend/src/services/agences.service.ts
import { fetchApi } from "./api";
import {
  AgenceCreate,
  AgenceRead,
  AgenceUpdate,
  EmployeCreate,
  EmployeRead,
  EmployeUpdate,
} from "@/types/agence";

export const agencesService = {
  // --- AGENCES ---
  listerAgences: async (): Promise<AgenceRead[]> => {
    return fetchApi<AgenceRead[]>("/admin/agences");
  },

  creerAgence: async (payload: AgenceCreate): Promise<AgenceRead> => {
    return fetchApi<AgenceRead>("/admin/agences", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  modifierAgence: async (agenceId: string, payload: AgenceUpdate): Promise<AgenceRead> => {
    return fetchApi<AgenceRead>(`/admin/agences/${agenceId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  // --- EMPLOYES ---
  listerEmployes: async (): Promise<EmployeRead[]> => {
    return fetchApi<EmployeRead[]>("/admin/employes");
  },

  creerEmploye: async (payload: EmployeCreate): Promise<EmployeRead> => {
    return fetchApi<EmployeRead>("/admin/employes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  modifierEmploye: async (employeId: string, payload: EmployeUpdate): Promise<EmployeRead> => {
    return fetchApi<EmployeRead>(`/admin/employes/${employeId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};