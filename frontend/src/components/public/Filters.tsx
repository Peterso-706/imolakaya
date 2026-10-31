"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { useReferentiels } from "@/hooks/useReferentiels";
import { Select } from "@/components/shared/Select";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { BienSearchParams } from "@/types/bien";
import { TypeOperation, TypeLocation } from "@/types/enums";

interface FiltersProps {
  initialParams: BienSearchParams;
  onApply: (params: BienSearchParams) => void;
}

export const Filters = ({ initialParams, onApply }: FiltersProps) => {
  const { categories, localisations, isLoading } = useReferentiels();
  const [isOpen, setIsOpen] = useState(false);
  const [filtres, setFiltres] = useState<BienSearchParams>(initialParams);

  const set = (key: keyof BienSearchParams, value: any) =>
    setFiltres((prev) => ({ ...prev, [key]: value }));

  const appliquer = () => {
    onApply(filtres);
    setIsOpen(false);
  };

  const reinitialiser = () => {
    const vide: BienSearchParams = { page: 1, taille: 20 };
    setFiltres(vide);
    onApply(vide);
  };

  const departements = Array.from(new Set(localisations.map((l) => l.departement)));

  return (
    <>
      {/* Bouton mobile pour ouvrir les filtres */}
      <div className="lg:hidden mb-4">
        <Button variant="ghost" onClick={() => setIsOpen(!isOpen)} fullWidth>
          <Filter size={16} />
          {isOpen ? "Masquer les filtres" : "Afficher les filtres"}
        </Button>
      </div>

      {/* Panneau de filtres */}
      <aside className={`${isOpen ? "block" : "hidden"} lg:block`}>
        <div className="bg-white rounded-lg border border-imo-gray shadow-card p-4 space-y-4 sticky top-20">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-imo-dark">Filtres</h3>
            <button onClick={reinitialiser} className="text-xs text-imo-green hover:underline">
              Réinitialiser
            </button>
          </div>

          <Select
            label="Type d'opération"
            placeholder="Tous"
            value={filtres.type_operation || ""}
            onChange={(e) => set("type_operation", e.target.value || undefined)}
            options={[
              { value: TypeOperation.VENTE, label: "Vente" },
              { value: TypeOperation.LOCATION, label: "Location" },
            ]}
          />

          <Select
            label="Type de bien"
            placeholder="Tous"
            value={filtres.type_location || ""}
            onChange={(e) => set("type_location", e.target.value || undefined)}
            options={[
              { value: TypeLocation.MAISON, label: "Maison" },
              { value: TypeLocation.APPARTEMENT, label: "Appartement" },
              { value: TypeLocation.CHAMBRE, label: "Chambre" },
              { value: TypeLocation.TERRAIN, label: "Terrain" },
              { value: TypeLocation.LOCAL_COMMERCIAL, label: "Local commercial" },
            ]}
          />

          <Select
            label="Catégorie"
            placeholder="Toutes"
            value={filtres.categorie_id || ""}
            onChange={(e) => set("categorie_id", e.target.value || undefined)}
            options={categories.map((c) => ({ value: c.id, label: c.nom }))}
          />

          <Select
            label="Département"
            placeholder="Tous"
            value={filtres.departement || ""}
            onChange={(e) => set("departement", e.target.value || undefined)}
            options={departements.map((d) => ({ value: d, label: d }))}
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Prix min"
              type="number"
              placeholder="0"
              value={filtres.prix_min ?? ""}
              onChange={(e) => set("prix_min", e.target.value ? Number(e.target.value) : undefined)}
            />
            <Input
              label="Prix max"
              type="number"
              placeholder="1000000"
              value={filtres.prix_max ?? ""}
              onChange={(e) => set("prix_max", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          <Button variant="primary" fullWidth onClick={appliquer} isLoading={isLoading}>
            Appliquer les filtres
          </Button>
        </div>
      </aside>
    </>
  );
};