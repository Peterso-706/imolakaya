"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { annoncesService } from "@/services/annonces.service";
import { AnnonceRead } from "@/types/annonce";
import { AnnonceValidator } from "@/components/admin/AnnonceValidator";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/shared/Button";
import { formatDateHeure } from "@/utils/format";

export default function AdminAnnonceDetailPage() {
  const params = useParams<{ id: string }>();
  const [annonce, setAnnonce] = useState<AnnonceRead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnonce = async () => {
    if (!params?.id) return;
    setIsLoading(true);
    try {
      // Pas d'endpoint GET /admin/annonces/{id} : on charge la 1ère page
      // et on filtre par id. En pratique, si vous en avez beaucoup,
      // ajoutez un endpoint GET côté backend.
      const response = await annoncesService.listerAdmin(1, 100);
      const trouvee = response.items.find((a) => a.id === params.id);
      if (!trouvee) {
        setError("Annonce introuvable.");
      } else {
        setAnnonce(trouvee);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !annonce) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error || "Annonce introuvable"}</p>
        <Link href="/admin/annonces">
          <Button variant="ghost">Retour aux annonces</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/annonces"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-imo-green mb-3"
        >
          <ArrowLeft size={14} /> Retour aux annonces
        </Link>
        <h1 className="text-2xl font-bold text-imo-dark">Détail de l&apos;annonce</h1>
      </div>

      <div className="bg-white rounded-lg border border-imo-gray p-6 space-y-4">
        <div>
          <p className="text-xs text-gray-500 uppercase">Titre</p>
          <p className="font-semibold text-imo-dark">{annonce.titre}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Description</p>
          <p className="text-sm text-gray-700 whitespace-pre-line">{annonce.description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 uppercase">Créée le</p>
            <p className="text-imo-dark">{formatDateHeure(annonce.cree_le)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Soumise le</p>
            <p className="text-imo-dark">{formatDateHeure(annonce.date_soumission)}</p>
          </div>
          {annonce.date_validation && (
            <div>
              <p className="text-xs text-gray-500 uppercase">Validée le</p>
              <p className="text-imo-dark">{formatDateHeure(annonce.date_validation)}</p>
            </div>
          )}
          {annonce.date_publication && (
            <div>
              <p className="text-xs text-gray-500 uppercase">Publiée le</p>
              <p className="text-imo-dark">{formatDateHeure(annonce.date_publication)}</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-imo-dark mb-3">Actions</h2>
        <AnnonceValidator annonce={annonce} onRefresh={fetchAnnonce} />
      </div>
    </div>
  );
}