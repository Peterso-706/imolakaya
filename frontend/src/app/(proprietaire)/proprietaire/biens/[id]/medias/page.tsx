"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { MediaUploader } from "@/components/proprietaire/MediaUploader";
import { biensService } from "@/services/biens.service";
import { BienReadDetail } from "@/types/bien";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/shared/Button";

export default function MediasPage() {
  const params = useParams<{ id: string }>();
  const [bien, setBien] = useState<BienReadDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chargerBien = async () => {
    if (!params?.id) return;
    try {
      const data = await biensService.getDetail(params.id);
      setBien(data);
    } catch {
      setError("Impossible de charger le bien.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chargerBien();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !bien) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error || "Bien introuvable"}</p>
        <Link href="/proprietaire/biens">
          <Button variant="ghost">Retour à mes biens</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/proprietaire/biens"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-imo-green mb-3"
        >
          <ArrowLeft size={14} /> Retour à mes biens
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-imo-dark">Gestion des médias</h1>
            <p className="text-sm text-gray-600">{bien.titre}</p>
          </div>
          <Link href={`/biens/${bien.id}`} target="_blank">
            <Button variant="ghost" size="sm">
              <Eye size={14} /> Voir la fiche publique
            </Button>
          </Link>
        </div>
      </div>

      <MediaUploader
        bienId={bien.id}
        medias={bien.medias}
        onRefresh={chargerBien}
      />
    </div>
  );
}