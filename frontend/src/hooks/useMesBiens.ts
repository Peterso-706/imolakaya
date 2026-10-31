"use client";

import { useState, useEffect, useCallback } from "react";
import { biensService } from "@/services/biens.service";
import { BienRead } from "@/types/bien";
import { PaginatedResponse } from "@/types/api";

export const useMesBiens = () => {
  const [data, setData] = useState<PaginatedResponse<BienRead> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchBiens = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await biensService.listerMesBiens(page);
      setData(response);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement de vos biens");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBiens();
  }, [fetchBiens]);

  return { data, isLoading, error, page, setPage, refetch: fetchBiens };
};