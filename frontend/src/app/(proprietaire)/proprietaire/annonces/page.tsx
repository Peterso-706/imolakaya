"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Send, Eye } from "lucide-react";
import { useAnnonces } from "@/hooks/useAnnonces";
import { annoncesService } from "@/services/annonces.service";
import { AnnonceForm } from "@/components/proprietaire/AnnonceForm";
import { AnnonceRead } from "@/types/annonce";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { Modal } from "@/components/shared/Modal";
import { useToast } from "@/contexts/ToastContext";
import { getErrorMessage } from "@/utils/errors";
import { formatDate } from "@/utils/format";
import { AnnonceCreateFormData } from "@/forms/annonce.schema";

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

function AnnoncesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { data, isLoading, error, page, setPage, refetch } = useAnnonces();
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [annonceASoumettre, setAnnonceASoumettre] = useState<AnnonceRead | null>(null);

  // Ouvre automatiquement le formulaire si ?bien_id est présent
  useEffect(() => {
    if (searchParams.get("bien_id")) setIsCreating(true);
  }, [searchParams]);

  const creerAnnonce = async (formData: AnnonceCreateFormData) => {
    try {
      await annoncesService.creer(formData);
      showToast("Annonce créée en brouillon", "success");
      setIsCreating(false);
      refetch();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  const soumettreAnnonce = async () => {
    if (!annonceASoumettre) return;
    setIsSubmitting(true);
    try {
      await annoncesService.soumettre(annonceASoumettre.id);
      showToast("Annonce soumise pour validation", "success");
      setAnnonceASoumettre(null);
      refetch();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-imo-dark">Mes annonces</h1>
          <p className="text-sm text-gray-600">
            {data ? `${data.total} annonce(s)` : "Créez et gérez vos annonces"}
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreating(true)}>
          <Plus size={16} /> Nouvelle annonce
        </Button>
      </div>

      {isLoading && <LoadingSpinner size="lg" />}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!isLoading && !error && data && data.items.length === 0 && (
        <EmptyState
          title="Aucune annonce"
          description="Créez une annonce à partir de l'un de vos biens pour commencer."
          actionLabel="Créer une annonce"
          onAction={() => setIsCreating(true)}
        />
      )}

      {!isLoading && !error && data && data.items.length > 0 && (
        <>
          <div className="bg-white rounded-lg border border-imo-gray overflow-hidden">
            <ul className="divide-y divide-imo-gray">
              {data.items.map((annonce) => {
                const peutSoumettre = annonce.statut === "BROUILLON" || annonce.statut === "REJETEE";
                return (
                  <li key={annonce.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-imo-dark truncate">{annonce.titre}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{annonce.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Créée le {formatDate(annonce.cree_le)}
                        {annonce.motif_rejet && ` · Motif de rejet : ${annonce.motif_rejet}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={statutVariant(annonce.statut)}>{annonce.statut}</Badge>
                      {peutSoumettre && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setAnnonceASoumettre(annonce)}
                        >
                          <Send size={14} /> Soumettre
                        </Button>
                      )}
                      {annonce.statut === "PUBLIEE" && (
                        <Link href={`/biens/${annonce.bien_id}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <Eye size={14} /> Voir
                          </Button>
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <Pagination currentPage={page} totalPages={data.pages} onPageChange={setPage} />
        </>
      )}

      {/* Modal : créer une annonce */}
      <Modal isOpen={isCreating} onClose={() => setIsCreating(false)} title="Créer une annonce">
        <AnnonceForm
          bienIdInitial={searchParams.get("bien_id") || undefined}
          onSubmit={creerAnnonce}
        />
      </Modal>

      {/* Modal : confirmer la soumission */}
      <Modal
        isOpen={!!annonceASoumettre}
        onClose={() => setAnnonceASoumettre(null)}
        title="Soumettre l'annonce pour validation"
      >
        <p className="text-sm text-gray-700 mb-6">
          Votre annonce <strong>{annonceASoumettre?.titre}</strong> sera envoyée à l&apos;administration
          pour vérification. Une fois approuvée, vous pourrez procéder au paiement pour la publier.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setAnnonceASoumettre(null)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={soumettreAnnonce} isLoading={isSubmitting}>
            <Send size={14} /> Confirmer
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default function AnnoncesPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <AnnoncesContent />
    </Suspense>
  );
}