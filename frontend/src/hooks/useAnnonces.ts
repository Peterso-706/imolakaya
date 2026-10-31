"use client";

import { useState, useEffect, useCallback } from "react";
import { annoncesService } from "@/services/annonces.service";
import { AnnonceRead } from "@/types/annonce";
import { PaginatedResponse } from "@/types/api";

export const useAnnonces = () => {
  const [data, setData] = useState<PaginatedResponse<AnnonceRead> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchAnnonces = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await annoncesService.lister(page);
      setData(response);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des annonces");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchAnnonces();
  }, [fetchAnnonces]);

  return { data, isLoading, error, page, setPage, refetch: fetchAnnonces };
};