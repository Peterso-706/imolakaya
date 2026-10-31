"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Image as ImageIcon, Trash2, Eye } from "lucide-react";
import { useMesBiens } from "@/hooks/useMesBiens";
import { biensService } from "@/services/biens.service";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { Pagination } from "@/components/shared/Pagination";
import { Modal } from "@/components/shared/Modal";
import { formatPrix, formatDate } from "@/utils/format";

export default function MesBiensPage() {
  const { data, isLoading, error, page, setPage, refetch } = useMesBiens();
  const [bienASupprimer, setBienASupprimer] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmerSuppression = async () => {
    if (!bienASupprimer) return;
    setIsDeleting(true);
    try {
      await biensService.supprimer(bienASupprimer);
      setBienASupprimer(null);
      refetch();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const badgeStatut = (statut: string) => {
    const map: Record<string, "success" | "warning" | "info" | "default"> = {
      DISPONIBLE: "success",
      RESERVE: "warning",
      LOUE: "info",
      VENDU: "default",
      RETIRE: "default",
    };
    return map[statut] || "default";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-imo-dark">Mes biens</h1>
          <p className="text-sm text-gray-600">
            {data ? `${data.total} bien(s) enregistré(s)` : "Gérez vos propriétés"}
          </p>
        </div>
        <Link href="/proprietaire/biens/nouveau">
          <Button variant="primary">
            <Plus size={16} /> Nouveau bien
          </Button>
        </Link>
      </div>

      {isLoading && <LoadingSpinner size="lg" />}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!isLoading && !error && data && data.items.length === 0 && (
        <EmptyState
          title="Aucun bien enregistré"
          description="Commencez par ajouter votre premier bien pour le publier sur la plateforme."
          actionLabel="Ajouter un bien"
          onAction={() => (window.location.href = "/proprietaire/biens/nouveau")}
        />
      )}

      {!isLoading && !error && data && data.items.length > 0 && (
        <>
          <div className="bg-white rounded-lg border border-imo-gray overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 bg-imo-light text-xs font-semibold text-gray-600 uppercase">
              <div className="col-span-5">Bien</div>
              <div className="col-span-2">Prix</div>
              <div className="col-span-2">Statut</div>
              <div className="col-span-1">Créé</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            <ul className="divide-y divide-imo-gray">
              {data.items.map((bien) => (
                <li key={bien.id} className="px-4 py-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-5 min-w-0">
                    <p className="font-semibold text-imo-dark truncate">{bien.titre}</p>
                    <p className="text-xs text-gray-500 truncate md:hidden">
                      {formatPrix(Number(bien.prix), bien.devise as any)} · {bien.statut}
                    </p>
                  </div>
                  <div className="hidden md:block md:col-span-2 text-sm font-semibold text-imo-green">
                    {formatPrix(Number(bien.prix), bien.devise as any)}
                  </div>
                  <div className="hidden md:block md:col-span-2">
                    <Badge variant={badgeStatut(bien.statut)}>{bien.statut}</Badge>
                  </div>
                  <div className="hidden md:block md:col-span-1 text-xs text-gray-500">
                    {formatDate(bien.cree_le)}
                  </div>
                  <div className="md:col-span-2 flex md:justify-end gap-2">
                    <Link
                      href={`/biens/${bien.id}`}
                      className="p-2 rounded-lg text-gray-500 hover:text-imo-green hover:bg-imo-green-50 transition"
                      title="Voir la fiche publique"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/proprietaire/biens/${bien.id}/medias`}
                      className="p-2 rounded-lg text-gray-500 hover:text-imo-green hover:bg-imo-green-50 transition"
                      title="Gérer les médias"
                    >
                      <ImageIcon size={16} />
                    </Link>
                    <Link
                      href={`/proprietaire/biens/${bien.id}`}
                      className="p-2 rounded-lg text-gray-500 hover:text-imo-green hover:bg-imo-green-50 transition"
                      title="Modifier"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => setBienASupprimer(bien.id)}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {data && (
            <Pagination currentPage={page} totalPages={data.pages} onPageChange={setPage} />
          )}
        </>
      )}

      {/* Modal de confirmation */}
      <Modal
        isOpen={!!bienASupprimer}
        onClose={() => setBienASupprimer(null)}
        title="Confirmer la suppression"
      >
        <p className="text-sm text-gray-700 mb-6">
          Êtes-vous sûr de vouloir supprimer ce bien ? Cette action est irréversible.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setBienASupprimer(null)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmerSuppression} isLoading={isDeleting}>
            Supprimer
          </Button>
        </div>
      </Modal>
    </div>
  );
}