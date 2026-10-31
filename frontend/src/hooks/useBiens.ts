"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { biensService } from "@/services/biens.service";
import { BienReadDetail, BienSearchParams } from "@/types/bien";
import { PaginatedResponse } from "@/types/api";

export const useBiens = (initialParams: BienSearchParams = {}) => {
  const [data, setData] = useState<PaginatedResponse<BienReadDetail> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<BienSearchParams>(initialParams);

  const requestIdRef = useRef(0);

  const fetchBiens = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const response = await biensService.rechercher(params);
      if (requestId === requestIdRef.current) setData(response);
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la récupération des biens"
        );
      }
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchBiens();
  }, [fetchBiens]);

  const updateParams = useCallback((newParams: Partial<BienSearchParams>) => {
    setParams((prev) => ({ ...prev, ...newParams, page: 1 }));
  }, []);

  const changePage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  return { data, isLoading, error, params, updateParams, changePage, refetch: fetchBiens };
};