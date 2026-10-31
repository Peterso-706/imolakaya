// frontend/src/hooks/useBiens.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { biensService } from "@/services/biens.service";
import { BienReadDetail, BienSearchParams } from "@/types/bien";
import { PaginatedResponse } from "@/types/api";

export const useBiens = (initialParams: BienSearchParams = {}) => {
  const [data, setData] = useState<PaginatedResponse<BienReadDetail> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<BienSearchParams>(initialParams);

  const fetchBiens = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await biensService.rechercher(params);
      setData(response);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la récupération des biens");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchBiens();
  }, [fetchBiens]);

  // Fonction pour mettre à jour les filtres et déclencher une nouvelle recherche
  const updateParams = (newParams: Partial<BienSearchParams>) => {
    setParams((prev) => ({ ...prev, ...newParams, page: 1 })); // Retour à la page 1 lors d'un nouveau filtre
  };

  // Fonction pour changer de page
  const changePage = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  return {
    data,
    isLoading,
    error,
    params,
    updateParams,
    changePage,
    refetch: fetchBiens,
  };
};