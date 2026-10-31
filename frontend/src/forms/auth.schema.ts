// frontend/src/forms/auth.schema.ts
import { z } from "zod";

// Basé sur LoginRequest
export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  mot_de_passe: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(128, "Le mot de passe ne peut pas dépasser 128 caractères"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Basé sur RegisterProprietaireRequest
export const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  mot_de_passe: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(128, "Le mot de passe ne peut pas dépasser 128 caractères"),
  nom: z
    .string()
    .min(1, "Le nom est obligatoire")
    .max(120, "Le nom ne peut pas dépasser 120 caractères"),
  prenom: z
    .string()
    .max(120, "Le prénom ne peut pas dépasser 120 caractères")
    .optional()
    .or(z.literal("")),
  telephone: z
    .string()
    .max(30, "Le téléphone ne peut pas dépasser 30 caractères")
    .optional()
    .or(z.literal("")),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Basé sur ChangePasswordRequest
export const changePasswordSchema = z
  .object({
    ancien_mot_de_passe: z.string().min(8, "Minimum 8 caractères").max(128),
    nouveau_mot_de_passe: z.string().min(8, "Minimum 8 caractères").max(128),
    confirmation: z.string().min(8, "Minimum 8 caractères").max(128),
  })
  .refine((data: { nouveau_mot_de_passe: any; confirmation: any; }) => data.nouveau_mot_de_passe === data.confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmation"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;