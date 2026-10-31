// frontend/src/hooks/useUser.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { utilisateursService } from "@/services/utilisateurs.service";
import { UtilisateurRead } from "@/types/utilisateur";
import { PaginatedResponse } from "@/types/api";

export const useUser = () => {
  const [data, setData] = useState<PaginatedResponse<UtilisateurRead> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchUtilisateurs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await utilisateursService.lister(page);
      setData(response);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUtilisateurs();
  }, [fetchUtilisateurs]);

  return { data, isLoading, error, page, setPage, refetch: fetchUtilisateurs };
};