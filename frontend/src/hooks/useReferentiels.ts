// frontend/src/hooks/useReferentiels.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { referentielsService } from "@/services/referentiels.service";
import { CategorieRead, LocalisationRead } from "@/types/bien";

export const useReferentiels = () => {
  const [categories, setCategories] = useState<CategorieRead[]>([]);
  const [localisations, setLocalisations] = useState<LocalisationRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cats, locs] = await Promise.all([
        referentielsService.listerCategoriesPubliques(),
        referentielsService.listerLocalisationsPubliques(),
      ]);
      setCategories(cats);
      setLocalisations(locs);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des référentiels");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { categories, localisations, isLoading, error, refetch: fetchAll };
};