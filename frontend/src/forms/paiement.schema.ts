// frontend/src/forms/paiement.schema.ts
import { z } from "zod";
import { Devise, MethodePaiement } from "@/types/enums";

// Basé sur PaiementCreateEnLigne
export const paiementEnLigneSchema = z.object({
  annonce_id: z.string().uuid("Annonce invalide"),
  montant: z.number({ invalid_type_error: "Montant invalide" }).positive("Le montant doit être supérieur à 0"),
  devise: z.nativeEnum(Devise).default(Devise.HTG),
  methode: z.nativeEnum(MethodePaiement, {
    errorMap: () => ({ message: "Méthode de paiement invalide" }),
  }),
});

export type PaiementEnLigneFormData = z.infer<typeof paiementEnLigneSchema>;

// Basé sur PaiementCreateAgence
export const paiementAgenceSchema = z.object({
  annonce_id: z.string().uuid("Annonce invalide"),
  proprietaire_id: z.string().uuid("Propriétaire invalide"),
  montant: z.number().positive("Le montant doit être supérieur à 0"),
  devise: z.nativeEnum(Devise).default(Devise.HTG),
  methode: z.nativeEnum(MethodePaiement),
  reference: z
    .string()
    .min(1, "La référence est obligatoire")
    .max(120, "Maximum 120 caractères"),
  agent_responsable: z
    .string()
    .min(1, "L'agent responsable est obligatoire")
    .max(200, "Maximum 200 caractères"),
  note_interne: z.string().optional().or(z.literal("")),
});

export type PaiementAgenceFormData = z.infer<typeof paiementAgenceSchema>;