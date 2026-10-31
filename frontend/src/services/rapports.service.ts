// frontend/src/services/rapports.service.ts
import { fetchApi } from "./api";

export interface TableauDeBordStats {
  biens_total: number;
  annonces_total: number;
  paiements_total: number;
  visites_total: number;
  contacts_total: number;
}

export const rapportsService = {
  // GET /api/v1/admin/rapports/tableau-de-bord
  getTableauDeBord: async (): Promise<TableauDeBordStats> => {
    return fetchApi<TableauDeBordStats>("/admin/rapports/tableau-de-bord");
  },
};