"use client";

import { useEffect, useState } from "react";
import { paiementsService } from "@/services/paiements.service";
import { PaiementRead } from "@/types/paiement";
import { PaiementVerifier } from "@/components/admin/PaiementVerifier";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { Select } from "@/components/shared/Select";

export default function AdminPaiementsPage() {
  const [data, setData] = useState<{ items: PaiementRead[]; total: number; page: number; pages: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filtreStatut, setFiltreStatut] = useState("");

  const fetchPaiements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await paiementsService.listerAdmin(page, 20);
      setData(response);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des paiements");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaiements();
  }, [page]);

  const paiementsFiltres = data?.items.filter((p) =>
    filtreStatut ? p.statut === filtreStatut : true
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-imo-dark">Gestion des paiements</h1>
          <p className="text-sm text-gray-600">
            {data ? `${data.total} paiement(s)` : "Vérifiez et confirmez les paiements"}
          </p>
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            options={[
              { value: "", label: "Tous les statuts" },
              { value: "EN_ATTENTE", label: "En attente" },
              { value: "CONFIRME", label: "Confirmés" },
              { value: "ECHOUE", label: "Échoués" },
              { value: "ANNULE", label: "Annulés" },
            ]}
          />
        </div>
      </div>

      {isLoading && <LoadingSpinner size="lg" />}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!isLoading && !error && paiementsFiltres.length === 0 && (
        <EmptyState
          title="Aucun paiement"
          description="Aucun paiement ne correspond au filtre sélectionné."
        />
      )}

      {!isLoading && !error && paiementsFiltres.length > 0 && (
        <>
          <div className="space-y-3">
            {paiementsFiltres.map((paiement) => (
              <PaiementVerifier
                key={paiement.id}
                paiement={paiement}
                onRefresh={fetchPaiements}
              />
            ))}
          </div>
          {data && (
            <Pagination currentPage={page} totalPages={data.pages} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}