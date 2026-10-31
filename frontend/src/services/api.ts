// frontend/src/services/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("@imolakaya:token");
  }

  // Détection du FormData : on ne met pas de Content-Type (le navigateur le gère)
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("@imolakaya:token");
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (errorData.detail && typeof errorData.detail === "object") {
      throw new ApiError(
        response.status,
        errorData.detail.code || "app_error",
        errorData.detail.message || "Une erreur est survenue"
      );
    }
    throw new ApiError(response.status, "unknown", errorData.detail || "Erreur serveur");
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

// Fonction utilitaire pour construire les query strings
export function buildQuery(params: Record<string, any>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });
  const str = query.toString();
  return str ? `?${str}` : "";
}