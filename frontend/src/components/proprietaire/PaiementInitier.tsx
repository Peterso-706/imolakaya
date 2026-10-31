"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paiementEnLigneSchema, PaiementEnLigneFormData } from "@/forms/paiement.schema";
import { paiementsService } from "@/services/paiements.service";
import { useAnnonces } from "@/hooks/useAnnonces";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import { Button } from "@/components/shared/Button";
import { useToast } from "@/contexts/ToastContext";
import { getErrorMessage } from "@/utils/errors";
import { Devise, MethodePaiement } from "@/types/enums";

interface PaiementInitierProps {
  onSuccess?: () => void;
}

export const PaiementInitier = ({ onSuccess }: PaiementInitierProps) => {
  const { showToast } = useToast();
  const { data: annonces, isLoading: annoncesLoading } = useAnnonces();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.input<typeof paiementEnLigneSchema>, any, PaiementEnLigneFormData>({
    resolver: zodResolver(paiementEnLigneSchema),
    defaultValues: {
      devise: Devise.HTG,
      methode: MethodePaiement.MONCASH,
    },
  });

  const onSubmit = async (data: PaiementEnLigneFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await paiementsService.creer(data);
      showToast("Paiement initié. Suivez les instructions du fournisseur.", "success");
      reset();
      onSuccess?.();
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const annoncesApprouvees = (annonces?.items || []).filter(
    (a) => a.statut === "APPROUVEE" || a.statut === "EN_ATTENTE"
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="bg-white rounded-lg border border-imo-gray p-5 space-y-4">
        <h2 className="font-bold text-imo-dark text-lg border-b border-imo-gray pb-3">
          Nouveau paiement
        </h2>

        <Select
          label="Annonce concernée *"
          placeholder={
            annoncesLoading
              ? "Chargement..."
              : annoncesApprouvees.length === 0
              ? "Aucune annonce éligible"
              : "Sélectionner une annonce"
          }
          error={errors.annonce_id?.message}
          options={annoncesApprouvees.map((a) => ({ value: a.id, label: a.titre }))}
          {...register("annonce_id")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Montant des frais *"
              type="number"
              step="0.01"
              placeholder="0"
              error={errors.montant?.message}
              {...register("montant", { valueAsNumber: true })}
            />
          </div>
          <Select
            label="Devise *"
            error={errors.devise?.message}
            options={[
              { value: Devise.HTG, label: "HTG" },
              { value: Devise.USD, label: "USD" },
            ]}
            {...register("devise")}
          />
        </div>

        <Select
          label="Méthode de paiement *"
          error={errors.methode?.message}
          options={[
            { value: MethodePaiement.MONCASH, label: "MonCash" },
            { value: MethodePaiement.NATCASH, label: "NatCash" },
            { value: MethodePaiement.CARTE_BANCAIRE, label: "Carte bancaire" },
          ]}
          {...register("methode")}
        />

        <p className="text-xs text-gray-500 bg-imo-light rounded p-3">
          💡 Le statut du paiement sera confirmé par le fournisseur via un webhook sécurisé. Ne fermez pas la page pendant le traitement.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
        disabled={annoncesApprouvees.length === 0}
      >
        Initier le paiement
      </Button>
    </form>
  );
};