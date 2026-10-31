"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useFavoris } from "@/hooks/useFavoris";
import { biensService } from "@/services/biens.service";
import { BienReadDetail } from "@/types/bien";
import { PropertyCard } from "@/components/public/PropertyCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/shared/Button";

export default function FavorisPage() {
  const { favoris, isLoading: loadingFavoris, error, retirer } = useFavoris();
  const [biens, setBiens] = useState<BienReadDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loadingFavoris) return;

    (async () => {
      if (favoris.length === 0) {
        setBiens([]);
        setIsLoading(false);
        return;
      }
      try {
        const resultats = await Promise.all(
          favoris.map((f) => biensService.getDetail(f.bien_id).catch(() => null))
        );
        setBiens(resultats.filter((b): b is BienReadDetail => b !== null));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [favoris, loadingFavoris]);

  const handleRetirer = async (bienId: string) => {
    await retirer(bienId);
    setBiens((prev) => prev.filter((b) => b.id !== bienId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-imo-dark">Mes favoris</h1>
        <p className="text-sm text-gray-600">
          {biens.length} bien(s) enregistré(s) dans vos favoris
        </p>
      </div>

      {(isLoading || loadingFavoris) && <LoadingSpinner size="lg" />}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!isLoading && !loadingFavoris && biens.length === 0 && (
        <EmptyState
          title="Aucun favori"
          description="Parcourez les biens disponibles et ajoutez ceux qui vous intéressent à vos favoris."
          actionLabel="Voir les biens"
          onAction={() => (window.location.href = "/biens")}
        />
      )}

      {!isLoading && !loadingFavoris && biens.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {biens.map((bien) => (
            <div key={bien.id} className="relative">
              <PropertyCard bien={bien} />
              <button
                onClick={() => handleRetirer(bien.id)}
                className="absolute top-2 right-2 bg-white text-red-600 hover:bg-red-50 p-2 rounded-full shadow-card transition z-10"
                title="Retirer des favoris"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}