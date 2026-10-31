"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import { Button } from "@/components/shared/Button";
import { useMesBiens } from "@/hooks/useMesBiens";
import { AnnonceCreateFormData, annonceCreateSchema } from "@/forms/annonce.schema";

interface AnnonceFormProps {
  bienIdInitial?: string;
  onSubmit: (data: AnnonceCreateFormData) => Promise<void>;
  isLoading?: boolean;
}

export const AnnonceForm = ({ bienIdInitial, onSubmit, isLoading = false }: AnnonceFormProps) => {
  const { data: biens, isLoading: biensLoading } = useMesBiens();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnonceCreateFormData>({
    resolver: zodResolver(annonceCreateSchema),
    defaultValues: {
      titre: "",
      description: "",
      bien_id: bienIdInitial || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="bg-white rounded-lg border border-imo-gray p-5 space-y-4">
        <h2 className="font-bold text-imo-dark text-lg border-b border-imo-gray pb-3">
          Informations de l&apos;annonce
        </h2>

        <Select
          label="Bien concerné *"
          placeholder={biensLoading ? "Chargement..." : "Sélectionner un bien"}
          error={errors.bien_id?.message}
          options={(biens?.items || []).map((b) => ({ value: b.id, label: b.titre }))}
          {...register("bien_id")}
        />

        <Input
          label="Titre de l'annonce *"
          placeholder="Ex : Magnifique villa avec vue sur mer"
          error={errors.titre?.message}
          {...register("titre")}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-imo-dark">Description *</label>
          <textarea
            rows={6}
            placeholder="Rédigez une description attrayante pour votre annonce..."
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
      </div>

      <Button type="submit" variant="primary" isLoading={isLoading}>
        Créer l&apos;annonce
      </Button>
    </form>
  );
};