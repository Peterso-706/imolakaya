// frontend/src/contexts/FiltersContext.tsx
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { BienSearchParams } from "@/types/bien";

interface FiltersContextType {
  filtres: BienSearchParams;
  setFiltres: (filtres: BienSearchParams) => void;
  updateFiltre: (key: keyof BienSearchParams, value: any) => void;
  reinitialiser: () => void;
}

const valeursInitiales: BienSearchParams = { page: 1, taille: 20 };

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [filtres, setFiltres] = useState<BienSearchParams>(valeursInitiales);

  const updateFiltre = useCallback((key: keyof BienSearchParams, value: any) => {
    setFiltres((prev) => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const reinitialiser = useCallback(() => {
    setFiltres(valeursInitiales);
  }, []);

  return (
    <FiltersContext.Provider value={{ filtres, setFiltres, updateFiltre, reinitialiser }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FiltersContext);
  if (!context) throw new Error("useFilters doit être utilisé dans un FiltersProvider");
  return context;
};