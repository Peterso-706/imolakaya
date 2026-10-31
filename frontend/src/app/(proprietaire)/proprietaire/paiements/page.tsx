"use client";

import { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import { usePaiements } from "@/hooks/usePaiements";
import { PaiementInitier } from "@/components/proprietaire/PaiementInitier";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { formatPrix, formatDateHeure } from "@/utils/format";

const statutVariant = (statut: string): "success" | "warning" | "danger" | "default" => {
  const map: Record<string, any> = {
    EN_ATTENTE: "warning",
    CONFIRME: "success",
    ECHOUE: "danger",
    ANNULE: "default",
  };
  return map[statut] || "default";
};

export default function PaiementsPage() {
  const { data, isLoading, error, page, setPage, refetch } = usePaiements();
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-imo-dark">Mes paiements</h1>
          <p className="text-sm text-gray-600">
            {data ? `${data.total} paiement(s)` : "Historique et nouveaux paiements"}
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreating(true)}>
          <Plus size={16} /> Nouveau paiement
        </Button>
      </div>

      {isLoading && <LoadingSpinner size="lg" />}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!isLoading && !error && data && data.items.length === 0 && (
        <EmptyState
          title="Aucun paiement"
          description="Vous n'avez effectué aucun paiement pour le moment. Initiez un paiement pour publier vos annonces approuvées."
          actionLabel="Faire un paiement"
          onAction={() => setIsCreating(true)}
        />
      )}

      {!isLoading && !error && data && data.items.length > 0 && (
        <>
          <div className="bg-white rounded-lg border border-imo-gray overflow-hidden">
            <ul className="divide-y divide-imo-gray">
              {data.items.map((p) => (
                <li key={p.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-imo-green-50 flex items-center justify-center flex-shrink-0">
                    <CreditCard size={20} className="text-imo-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-imo-dark">
                      {formatPrix(Number(p.montant), p.devise as any)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.methode} · Réf. {p.reference}
                    </p>
                    <p className="text-xs text-gray-400">
                      {p.date_paiement
                        ? `Payé le ${formatDateHeure(p.date_paiement)}`
                        : `Créé le ${formatDateHeure(p.cree_le)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statutVariant(p.statut)}>{p.statut}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Pagination currentPage={page} totalPages={data.pages} onPageChange={setPage} />
        </>
      )}

      <Modal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Initier un paiement"
      >
        <PaiementInitier
          onSuccess={() => {
            setIsCreating(false);
            refetch();
          }}
        />
      </Modal>
    </div>
  );
}