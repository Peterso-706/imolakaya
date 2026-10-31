// frontend/src/hooks/useRapports.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { rapportsService, TableauDeBordStats } from "@/services/rapports.service";

export const useRapports = () => {
  const [stats, setStats] = useState<TableauDeBordStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await rapportsService.getTableauDeBord();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des statistiques");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
};