// frontend/src/hooks/useVisite.ts
"use client";

import { useEffect, useRef } from "react";
import { visitesService } from "@/services/visites.service";

export const useVisite = (bienId: string | null) => {
  const dejaEnregistre = useRef(false);

  useEffect(() => {
    if (!bienId || dejaEnregistre.current) return;
    dejaEnregistre.current = true;

    // Enregistrement silencieux (on ignore les erreurs)
    visitesService.enregistrer({ bien_id: bienId }).catch(() => {
      // Silencieux : une visite ratée ne doit pas casser la page
    });
  }, [bienId]);
};