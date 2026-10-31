"use client";

import { useState, useCallback } from "react";
import { mediasService } from "@/services/medias.service";
import { MediaRead } from "@/types/media";

export const useMedias = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploader = useCallback(async (bienId: string, fichier: File, estCouverture = false): Promise<MediaRead | null> => {
    setIsUploading(true);
    setError(null);
    try {
      const media = await mediasService.uploader(bienId, fichier, estCouverture);
      return media;
    } catch (err: any) {
      setError(err.message || "Erreur lors du téléversement");
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const supprimer = useCallback(async (mediaId: string) => {
    try {
      await mediasService.supprimer(mediaId);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression");
    }
  }, []);

  return { uploader, supprimer, isUploading, error };
};