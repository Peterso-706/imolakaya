// frontend/src/hooks/useContactForm.ts
"use client";

import { useState } from "react";
import { contactsService } from "@/services/contacts.service";
import { ContactCreatePublic } from "@/types/interaction";
import { getErrorMessage } from "@/utils/errors";

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const envoyer = async (payload: ContactCreatePublic) => {
    setIsSubmitting(true);
    setError(null);
    setIsSuccess(false);
    try {
      await contactsService.creerPublic(payload);
      setIsSuccess(true);
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setIsSuccess(false);
    setError(null);
  };

  return { envoyer, isSubmitting, isSuccess, error, reset };
};