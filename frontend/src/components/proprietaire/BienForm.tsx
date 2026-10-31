"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bienCreateSchema, BienCreateFormData } from "@/forms/bien.schema";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import { Button } from "@/components/shared/Button";
import { useReferentiels } from "@/hooks/useReferentiels";
import { TypeOperation, TypeLocation, Devise, FrequencePaiement, StatutBien } from "@/types/enums";
import { BienRead } from "@/types/bien";

interface BienFormProps {
  bienInitial?: BienRead | null;
  onSubmit: (data: BienCreateFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export const BienForm = ({
  bienInitial,
  onSubmit,
  isLoading = false,
  submitLabel = "Enregistrer",
}: BienFormProps) => {
  const { categories, localisations, isLoading: refLoading } = useReferentiels();
  const [showTypeLocation, setShowTypeLocation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<z.input<typeof bienCreateSchema>, any, BienCreateFormData>({
    resolver: zodResolver(bienCreateSchema),
    defaultValues: bienInitial
      ? {
          titre: bienInitial.titre,
          description: bienInitial.description,
          type_operation: bienInitial.type_operation,
          type_location: bienInitial.type_location || null,
          prix: Number(bienInitial.prix),
          devise: bienInitial.devise,
          frequence_paiement: bienInitial.frequence_paiement || null,
          nombre_chambres: bienInitial.nombre_chambres ?? null,
          nombre_salles_bain: bienInitial.nombre_salles_bain ?? null,
          superficie_m2: bienInitial.superficie_m2 ?? null,
          annee_construction: bienInitial.annee_construction ?? null,
          caracteristiques: bienInitial.caracteristiques || null,
          categorie_id: bienInitial.categorie_id,
          localisation_id: bienInitial.localisation_id,
          statut: bienInitial.statut,
          reference_interne: undefined,
        }
      : {
          type_operation: TypeOperation.VENTE,
          devise: Devise.HTG,
          statut: StatutBien.DISPONIBLE,
        },
  });

  const typeOperation = watch("type_operation");

  useEffect(() => {
    setShowTypeLocation(typeOperation === TypeOperation.LOCATION);
  }, [typeOperation]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section : Informations générales */}
      <div className="bg-white rounded-lg border border-imo-gray p-5 space-y-4">
        <h2 className="font-bold text-imo-dark text-lg border-b border-imo-gray pb-3">
          Informations générales
        </h2>

        <Input
          label="Titre de l'annonce *"
          placeholder="Ex : Belle maison 3 chambres à Pétion-Ville"
          error={errors.titre?.message}
          {...register("titre")}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-imo-dark">Description *</label>
          <textarea
            rows={5}
            placeholder="Décrivez le bien en détail..."
            className={`w-full px-3 py-2 border rounded-lg outline-none transition-all bg-white text-imo-dark placeholder:text-gray-400 resize-none ${
              errors.description
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-imo-gray focus:border-imo-green focus:ring-2 focus:ring-imo-green/20"
            }`}
            {...register("description")}
          />
          {errors.description && (
            <span className="text-xs text-red-500">{errors.description.message}</span>
          )}
        </div>

        <Select
          label="Type d'opération *"
          error={errors.type_operation?.message}
          options={[
            { value: TypeOperation.VENTE, label: "Vente" },
            { value: TypeOperation.LOCATION, label: "Location" },
          ]}
          {...register("type_operation")}
        />

        {showTypeLocation && (
          <Select
            label="Type de location *"
            error={errors.type_location?.message}
            options={[
              { value: TypeLocation.MAISON, label: "Maison entière" },
              { value: TypeLocation.APPARTEMENT, label: "Appartement" },
              { value: TypeLocation.CHAMBRE, label: "Chambre" },
              { value: TypeLocation.LOCAL_COMMERCIAL, label: "Local commercial" },
            ]}
            {...register("type_location")}
          />
        )}
      </div>

      {/* Section : Prix */}
      <div className="bg-white rounded-lg border border-imo-gray p-5 space-y-4">
        <h2 className="font-bold text-imo-dark text-lg border-b border-imo-gray pb-3">Prix</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Prix *"
              type="number"
              step="0.01"
              placeholder="0"
              error={errors.prix?.message}
              {...register("prix", { valueAsNumber: true })}
            />
          </div>
          <Select
            label="Devise *"
            error={errors.devise?.message}
            options={[
              { value: Devise.HTG, label: "HTG (Gourde)" },
              { value: Devise.USD, label: "USD (Dollar)" },
              { value: Devise.EUR, label: "EUR (Euro)" },
            ]}
            {...register("devise")}
          />
        </div>

        {typeOperation === TypeOperation.LOCATION && (
          <Select
            label="Fréquence de paiement"
            error={errors.frequence_paiement?.message}
            placeholder="Sélectionner"
            options={[
              { value: FrequencePaiement.MENSUEL, label: "Mensuel" },
              { value: FrequencePaiement.TRIMESTRIEL, label: "Trimestriel" },
              { value: FrequencePaiement.SEMESTRIEL, label: "Semestriel" },
              { value: FrequencePaiement.ANNUEL, label: "Annuel" },
            ]}
            {...register("frequence_paiement")}
          />
        )}
      </div>

      {/* Section : Caractéristiques */}
      <div className="bg-white rounded-lg border border-imo-gray p-5 space-y-4">
        <h2 className="font-bold text-imo-dark text-lg border-b border-imo-gray pb-3">
          Caractéristiques
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre de chambres"
            type="number"
            placeholder="0"
            error={errors.nombre_chambres?.message}
            {...register("nombre_chambres", { valueAsNumber: true })}
          />
          <Input
            label="Nombre de salles de bain"
            type="number"
            placeholder="0"
            error={errors.nombre_salles_bain?.message}
            {...register("nombre_salles_bain", { valueAsNumber: true })}
          />
          <Input
            label="Superficie (m²)"
            type="number"
            step="0.01"
            placeholder="0"
            error={errors.superficie_m2?.message}
            {...register("superficie_m2", { valueAsNumber: true })}
          />
          <Input
            label="Année de construction"
            type="number"
            placeholder="2020"
            error={errors.annee_construction?.message}
            {...register("annee_construction", { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Section : Localisation et catégorie */}
      <div className="bg-white rounded-lg border border-imo-gray p-5 space-y-4">
        <h2 className="font-bold text-imo-dark text-lg border-b border-imo-gray pb-3">
          Localisation
        </h2>

        <Select
          label="Catégorie *"
          placeholder={refLoading ? "Chargement..." : "Sélectionner"}
          error={errors.categorie_id?.message}
          options={categories.map((c) => ({ value: c.id, label: c.nom }))}
          {...register("categorie_id")}
        />

        <Select
          label="Localisation *"
          placeholder={refLoading ? "Chargement..." : "Sélectionner"}
          error={errors.localisation_id?.message}
          options={localisations.map((l) => ({
            value: l.id,
            label: `${l.zone}, ${l.commune} (${l.departement})`,
          }))}
          {...register("localisation_id")}
        />
      </div>

      {/* Bouton de soumission */}
      <div className="flex gap-3">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};