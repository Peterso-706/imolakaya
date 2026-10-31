// frontend/src/hooks/useAvis.ts
"use client";

import { useState } from "react";
import { avisService } from "@/services/avis.service";
import { AvisCreate } from "@/types/interaction";
import { getErrorMessage } from "@/utils/errors";

export const useAvis = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const soumettre = async (payload: AvisCreate) => {
    setIsSubmitting(true);
    setError(null);
    setIsSuccess(false);
    try {
      await avisService.creer(payload);
      setIsSuccess(true);
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { soumettre, isSubmitting, isSuccess, error };
};