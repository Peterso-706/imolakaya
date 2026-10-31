"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { annoncesService } from "@/services/annonces.service";
import { AnnonceRead } from "@/types/annonce";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { formatDateHeure } from "@/utils/format";

const statutVariant = (statut: string): "success" | "warning" | "info" | "danger" | "default" => {
  const map: Record<string, any> = {
    BROUILLON: "default",
    EN_ATTENTE: "warning",
    APPROUVEE: "info",
    REJETEE: "danger",
    PUBLIEE: "success",
    EXPIREE: "default",
  };
  return map[statut] || "default";
};

export default function AnnonceDetailPage() {
  const params = useParams<{ id: string }>();
  const [annonce, setAnnonce] = useState<AnnonceRead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    (async () => {
      try {
        // Pas de GET /proprietaire/annonces/{id} : on charge la 1ère page
        // et on filtre. Pour beaucoup d'annonces, ajoutez l'endpoint côté backend.
        const res = await annoncesService.lister(1, 100);
        const trouvee = res.items.find((a) => a.id === params.id);
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
    })();
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
        <Link href="/proprietaire/annonces">
          <Button variant="ghost">Retour à mes annonces</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/proprietaire/annonces"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-imo-green mb-3"
        >
          <ArrowLeft size={14} /> Retour à mes annonces
        </Link>
        <div className="flex items-start gap-2 flex-wrap">
          <Badge variant={statutVariant(annonce.statut)}>{annonce.statut}</Badge>
        </div>
        <h1 className="text-2xl font-bold text-imo-dark mt-2">{annonce.titre}</h1>
      </div>

      <div className="bg-white rounded-lg border border-imo-gray p-6 space-y-4">
        <div>
          <p className="text-xs text-gray-500 uppercase">Description</p>
          <p className="text-sm text-gray-700 whitespace-pre-line">{annonce.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-4 border-t border-imo-gray">
          <div>
            <p className="text-xs text-gray-500 uppercase">Créée le</p>
            <p className="text-imo-dark">{formatDateHeure(annonce.cree_le)}</p>
          </div>
          {annonce.date_soumission && (
            <div>
              <p className="text-xs text-gray-500 uppercase">Soumise le</p>
              <p className="text-imo-dark">{formatDateHeure(annonce.date_soumission)}</p>
            </div>
          )}
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
          {annonce.date_expiration && (
            <div>
              <p className="text-xs text-gray-500 uppercase">Expire le</p>
              <p className="text-imo-dark">{formatDateHeure(annonce.date_expiration)}</p>
            </div>
          )}
        </div>

        {annonce.motif_rejet && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
            <p className="font-semibold mb-1">Motif de rejet</p>
            <p>{annonce.motif_rejet}</p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Link href={`/biens/${annonce.bien_id}`} target="_blank">
          <Button variant="ghost">Voir le bien public</Button>
        </Link>
        <Link href={`/proprietaire/biens/${annonce.bien_id}`}>
          <Button variant="ghost">Gérer le bien</Button>
        </Link>
      </div>
    </div>
  );
}