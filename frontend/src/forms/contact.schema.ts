// frontend/src/forms/contact.schema.ts
import { z } from "zod";

// Basé sur ContactCreatePublic
export const contactCreateSchema = z.object({
  bien_id: z.string().uuid("Bien invalide"),
  nom_visiteur: z
    .string()
    .min(1, "Le nom est obligatoire")
    .max(150, "Le nom ne peut pas dépasser 150 caractères"),
  email_visiteur: z.string().email("Email invalide"),
  telephone_visiteur: z
    .string()
    .max(30, "Le téléphone ne peut pas dépasser 30 caractères")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(5, "Le message doit contenir au moins 5 caractères")
    .max(5000, "Le message ne peut pas dépasser 5000 caractères"),
});

export type ContactCreateFormData = z.infer<typeof contactCreateSchema>;