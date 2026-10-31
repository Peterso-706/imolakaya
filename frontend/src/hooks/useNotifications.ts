"use client";

import { useState, useEffect, useCallback } from "react";
import { notificationsService } from "@/services/notifications.service";
import { NotificationRead } from "@/types/interaction";
import { PaginatedResponse } from "@/types/api";

export const useNotifications = () => {
  const [data, setData] = useState<PaginatedResponse<NotificationRead> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationsService.lister(page);
      setData(response);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des notifications");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const marquerLue = async (notifId: string) => {
    try {
      await notificationsService.marquerLue(notifId);
      await fetchNotifications();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { data, isLoading, error, page, setPage, marquerLue, refetch: fetchNotifications };
};