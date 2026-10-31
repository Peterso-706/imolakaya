"use client";

import { useEffect, useState } from "react";
import { annoncesService } from "@/services/annonces.service";
import { AnnonceRead } from "@/types/annonce";
import { AnnonceValidator } from "@/components/admin/AnnonceValidator";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { Select } from "@/components/shared/Select";

export default function AdminAnnoncesPage() {
  const [data, setData] = useState<{ items: AnnonceRead[]; total: number; page: number; pages: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filtreStatut, setFiltreStatut] = useState<string>("");

  const fetchAnnonces = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await annoncesService.listerAdmin(page, 20);
      setData(response);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des annonces");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, [page]);

  const annoncesFiltrees = data?.items.filter((a) =>
    filtreStatut ? a.statut === filtreStatut : true
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-imo-dark">Validation des annonces</h1>
          <p className="text-sm text-gray-600">
            {data ? `${data.total} annonce(s) au total` : "Gérez les annonces soumises"}
          </p>
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            options={[
              { value: "", label: "Tous les statuts" },
              { value: "EN_ATTENTE", label: "En attente" },
              { value: "APPROUVEE", label: "Approuvées" },
              { value: "REJETEE", label: "Rejetées" },
              { value: "PUBLIEE", label: "Publiées" },
            ]}
          />
        </div>
      </div>

      {isLoading && <LoadingSpinner size="lg" />}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!isLoading && !error && annoncesFiltrees.length === 0 && (
        <EmptyState
          title="Aucune annonce"
          description="Aucune annonce ne correspond au filtre sélectionné."
        />
      )}

      {!isLoading && !error && annoncesFiltrees.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {annoncesFiltrees.map((annonce) => (
              <AnnonceValidator key={annonce.id} annonce={annonce} onRefresh={fetchAnnonces} />
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