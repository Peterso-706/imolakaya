// frontend/src/utils/errors.ts
import { ApiError } from "@/services/api";

/**
 * Convertit une erreur API en message lisible
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    // Messages selon le code d'erreur du backend
    const messages: Record<string, string> = {
      unauthorized: "Vous devez être connecté pour effectuer cette action.",
      forbidden: "Vous n'avez pas les droits pour effectuer cette action.",
      not_found: "La ressource demandée est introuvable.",
      conflict: "Un conflit est survenu (donnée déjà existante).",
      bad_request: "La requête est invalide.",
      validation_error: "Les données fournies sont invalides.",
      too_many_requests: "Trop de requêtes. Veuillez patienter.",
    };
    return messages[error.code] || error.message;
  }
  if (error instanceof Error) return error.message;
  return "Une erreur inattendue est survenue.";
}