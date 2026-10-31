// frontend/src/forms/bien.schema.ts
import { z } from "zod";
import { TypeOperation, TypeLocation, Devise, FrequencePaiement, StatutBien } from "@/types/enums";

// Basé sur BienCreate
const bienBaseSchema = z.object({
  titre: z
    .string()
    .min(1, "Le titre est obligatoire")
    .max(200, "Le titre ne peut pas dépasser 200 caractères"),
  description: z.string().min(1, "La description est obligatoire"),
  type_operation: z.nativeEnum(TypeOperation, {
    errorMap: () => ({ message: "Type d'opération invalide" }),
  }),
  type_location: z.nativeEnum(TypeLocation).optional().nullable(),
  prix: z.number({ invalid_type_error: "Le prix doit être un nombre" }).min(0, "Le prix doit être positif"),
  devise: z.nativeEnum(Devise).default(Devise.HTG),
  frequence_paiement: z.nativeEnum(FrequencePaiement).optional().nullable(),
  nombre_chambres: z.number().min(0, "Minimum 0").optional().nullable(),
  nombre_salles_bain: z.number().min(0, "Minimum 0").optional().nullable(),
  superficie_m2: z.number().min(0, "Minimum 0").optional().nullable(),
  annee_construction: z
    .number()
    .min(1800, "L'année doit être supérieure à 1800")
    .max(2100, "L'année doit être inférieure à 2100")
    .optional()
    .nullable(),
  caracteristiques: z.record(z.any()).optional().nullable(),
  categorie_id: z.string().uuid("Catégorie invalide"),
  localisation_id: z.string().uuid("Localisation invalide"),
  statut: z.nativeEnum(StatutBien).default(StatutBien.DISPONIBLE),
  reference_interne: z
    .string()
    .max(50, "Maximum 50 caractères")
    .optional()
    .or(z.literal("")),
});

export const bienCreateSchema = bienBaseSchema
  // Reproduit le model_validator "_coherence_type_location" du backend
  .refine(
    (data: any) => {
      if (data.type_operation === TypeOperation.LOCATION && !data.type_location) {
        return false;
      }
      return true;
    },
    {
      message: "Le type de location est obligatoire pour une location",
      path: ["type_location"],
    }
  )
  .refine(
    (data: any) => {
      if (data.type_operation === TypeOperation.VENTE && data.type_location) {
        return false;
      }
      return true;
    },
    {
      message: "Le type de location doit être vide pour une vente",
      path: ["type_location"],
    }
  );

export type BienCreateFormData = z.infer<typeof bienCreateSchema>;

// Basé sur BienUpdate (tous les champs optionnels)
export const bienUpdateSchema = bienBaseSchema.deepPartial();
export type BienUpdateFormData = z.infer<typeof bienUpdateSchema>;