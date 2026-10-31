"use client";

import { useState, useEffect, useCallback } from "react";
import { paiementsService } from "@/services/paiements.service";
import { PaiementRead } from "@/types/paiement";
import { PaginatedResponse } from "@/types/api";

export const usePaiements = () => {
  const [data, setData] = useState<PaginatedResponse<PaiementRead> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchPaiements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await paiementsService.lister(page);
      setData(response);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des paiements");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPaiements();
  }, [fetchPaiements]);

  return { data, isLoading, error, page, setPage, refetch: fetchPaiements };
};