"use client";

import { useState, useEffect, useCallback } from "react";
import { favorisService } from "@/services/favoris.service";
import { FavoriRead } from "@/types/interaction";

export const useFavoris = () => {
  const [favoris, setFavoris] = useState<FavoriRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavoris = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await favorisService.lister();
      setFavoris(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des favoris");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavoris();
  }, [fetchFavoris]);

  const ajouter = async (bienId: string) => {
    try {
      await favorisService.ajouter({ bien_id: bienId });
      await fetchFavoris();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const retirer = async (bienId: string) => {
    try {
      await favorisService.retirer(bienId);
      setFavoris((prev) => prev.filter((f) => f.bien_id !== bienId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { favoris, isLoading, error, ajouter, retirer, refetch: fetchFavoris };
};