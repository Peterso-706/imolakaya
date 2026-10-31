"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Filters } from "@/components/public/Filters";
import { PropertyGrid } from "@/components/public/PropertyGrid";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Select } from "@/components/shared/Select";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { useBiens } from "@/hooks/useBiens";
import { BienSearchParams } from "@/types/bien";

type TriOption = "recent" | "prix_asc" | "prix_desc";

function RechercheContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Récupérer les paramètres depuis l'URL
  const initialParams: BienSearchParams = {
    q: searchParams.get("q") || undefined,
    type_operation: (searchParams.get("type_operation") as any) || undefined,
    type_location: (searchParams.get("type_location") as any) || undefined,
    categorie_id: searchParams.get("categorie_id") || undefined,
    departement: searchParams.get("departement") || undefined,
    commune: searchParams.get("commune") || undefined,
    zone: searchParams.get("zone") || undefined,
    prix_min: searchParams.get("prix_min") ? Number(searchParams.get("prix_min")) : undefined,
    prix_max: searchParams.get("prix_max") ? Number(searchParams.get("prix_max")) : undefined,
    page: 1,
    taille: 20,
  };

  const { data, isLoading, error, params, updateParams, changePage } = useBiens(initialParams);

  const [q, setQ] = useState(initialParams.q || "");
  const [tri, setTri] = useState<TriOption>("recent");

  // Synchroniser l'URL quand les filtres changent
  useEffect(() => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && key !== "page" && key !== "taille") {
        query.set(key, String(value));
      }
    });
    const nouvelleUrl = `/rechercher${query.toString() ? `?${query}` : ""}`;
    router.replace(nouvelleUrl, { scroll: false });
  }, [params, router]);

  // Trier les résultats localement
  const biensTries = data?.items ? [...data.items].sort((a, b) => {
    if (tri === "prix_asc") return Number(a.prix) - Number(b.prix);
    if (tri === "prix_desc") return Number(b.prix) - Number(a.prix);
    // "recent" : par date de création (déjà trié côté backend)
    return new Date(b.cree_le).getTime() - new Date(a.cree_le).getTime();
  }) : [];

  const lancerRecherche = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: q.trim() || undefined });
  };

  return (
    <div className="container-app py-8">
      {/* En-tête de recherche */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-imo-dark mb-2">
          Rechercher un bien
        </h1>
        <p className="text-sm text-gray-600">
          Affinez votre recherche pour trouver le bien qui vous correspond.
        </p>
      </div>

      {/* Barre de recherche principale */}
      <form
        onSubmit={lancerRecherche}
        className="bg-white rounded-lg border border-imo-gray shadow-card p-2 flex flex-col sm:flex-row gap-2 mb-8"
      >
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ville, zone, mot-clé (ex : Pétion-Ville, appartement 2 chambres...)"
            className="flex-1 py-3 text-imo-dark outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          type="submit"
          className="bg-imo-green hover:bg-imo-green-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Rechercher
        </button>
      </form>

      {/* Résultats + filtres */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Colonne filtres */}
        <div className="lg:col-span-1">
          <Filters initialParams={params} onApply={(newParams) => updateParams(newParams)} />
        </div>

        {/* Colonne résultats */}
        <div className="lg:col-span-3">
          {/* Barre d'info + tri */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <SlidersHorizontal size={14} />
              {data ? (
                <span>
                  <strong className="text-imo-dark">{data.total}</strong> bien(s) trouvé(s)
                </span>
              ) : (
                <span>Recherche en cours...</span>
              )}
            </div>
            <div className="w-full sm:w-56">
              <Select
                placeholder=""
                value={tri}
                onChange={(e) => setTri(e.target.value as TriOption)}
                options={[
                  { value: "recent", label: "Plus récents" },
                  { value: "prix_asc", label: "Prix croissant" },
                  { value: "prix_desc", label: "Prix décroissant" },
                ]}
              />
            </div>
          </div>

          {/* Résultats */}
          {isLoading && (
            <div className="py-16">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!isLoading && !error && biensTries.length === 0 && (
            <div className="bg-white rounded-lg border border-imo-gray p-12 text-center">
              <Search className="mx-auto mb-3 text-gray-300" size={48} />
              <h3 className="text-lg font-bold text-imo-dark mb-2">
                Aucun résultat
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Aucun bien ne correspond à vos critères. Essayez d&apos;élargir votre recherche.
              </p>
              <Button variant="ghost" onClick={() => updateParams({})} size="sm">
                Réinitialiser les filtres
              </Button>
            </div>
          )}

          {!isLoading && !error && biensTries.length > 0 && (
            <>
              <PropertyGrid biens={biensTries} />
              {data && (
                <Pagination
                  currentPage={data.page}
                  totalPages={data.pages}
                  onPageChange={changePage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecherchePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <RechercheContent />
    </Suspense>
  );
}