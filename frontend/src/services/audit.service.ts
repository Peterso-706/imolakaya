// frontend/src/services/audit.service.ts
import { fetchApi, buildQuery } from "./api";
import { AuditLogRead } from "@/types/audit";
import { PaginatedResponse } from "@/types/api";

export const auditService = {
  // GET /api/v1/admin/audit
  lister: async (page = 1, taille = 20): Promise<PaginatedResponse<AuditLogRead>> => {
    const query = buildQuery({ page, taille });
    return fetchApi<PaginatedResponse<AuditLogRead>>(`/admin/audit${query}`);
  },
};