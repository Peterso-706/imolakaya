// frontend/src/hooks/useAgences.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { agencesService } from "@/services/agences.service";
import { AgenceRead, EmployeRead } from "@/types/agence";

export const useAgences = () => {
  const [agences, setAgences] = useState<AgenceRead[]>([]);
  const [employes, setEmployes] = useState<EmployeRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [agencesData, employesData] = await Promise.all([
        agencesService.listerAgences(),
        agencesService.listerEmployes(),
      ]);
      setAgences(agencesData);
      setEmployes(employesData);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des agences");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { agences, employes, isLoading, error, refetch: fetchAll };
};