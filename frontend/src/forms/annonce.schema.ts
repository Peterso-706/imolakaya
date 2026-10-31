// frontend/src/forms/annonce.schema.ts
import { z } from "zod";

// Basé sur AnnonceCreate
export const annonceCreateSchema = z.object({
  titre: z
    .string()
    .min(1, "Le titre est obligatoire")
    .max(200, "Le titre ne peut pas dépasser 200 caractères"),
  description: z.string().min(1, "La description est obligatoire"),
  bien_id: z.string().uuid("Bien invalide"),
});

export type AnnonceCreateFormData = z.infer<typeof annonceCreateSchema>;

// Basé sur AnnonceUpdate
export const annonceUpdateSchema = z.object({
  titre: z.string().max(200).optional(),
  description: z.string().optional(),
});

export type AnnonceUpdateFormData = z.infer<typeof annonceUpdateSchema>;

// Basé sur AnnonceRejeterRequest
export const annonceRejeterSchema = z.object({
  motif: z
    .string()
    .min(5, "Le motif doit contenir au moins 5 caractères")
    .max(500, "Le motif ne peut pas dépasser 500 caractères"),
});

export type AnnonceRejeterFormData = z.infer<typeof annonceRejeterSchema>;