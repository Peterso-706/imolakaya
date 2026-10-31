// frontend/src/hooks/useAudit.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { auditService } from "@/services/audit.service";
import { AuditLogRead } from "@/types/audit";
import { PaginatedResponse } from "@/types/api";

export const useAudit = () => {
  const [data, setData] = useState<PaginatedResponse<AuditLogRead> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchAudit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await auditService.lister(page);
      setData(response);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement du journal d'audit");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchAudit();
  }, [fetchAudit]);

  return { data, isLoading, error, page, setPage, refetch: fetchAudit };
};