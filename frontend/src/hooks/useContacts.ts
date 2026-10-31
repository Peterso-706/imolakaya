"use client";

import { useState, useEffect, useCallback } from "react";
import { contactsService } from "@/services/contacts.service";
import { ContactRead } from "@/types/interaction";
import { PaginatedResponse } from "@/types/api";

export const useContacts = () => {
  const [data, setData] = useState<PaginatedResponse<ContactRead> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await contactsService.lister(page);
      setData(response);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des contacts");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return { data, isLoading, error, page, setPage, refetch: fetchContacts };
};