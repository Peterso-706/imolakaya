// frontend/src/utils/format.ts

/**
 * Formate un prix en fonction de la devise
 */
export function formatPrix(prix: number, devise: "HTG" | "USD" | "EUR" = "HTG"): string {
  const symboles = { HTG: "G", USD: "$", EUR: "€" };
  return `${prix.toLocaleString("fr-FR")} ${symboles[devise]}`;
}

/**
 * Formate une date en français
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/**
 * Formate une date et heure
 */
export function formatDateHeure(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formate un numéro de téléphone haïtien
 */
export function formatTelephone(tel: string | null | undefined): string {
  if (!tel) return "-";
  // Format basique : +509 1234-5678
  const cleaned = tel.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("509")) {
    return `+509 ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  return tel;
}