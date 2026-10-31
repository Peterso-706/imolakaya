// frontend/src/app/(proprietaire)/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/proprietaire/Sidebar";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

/**
 * Layout de l'espace propriétaire.
 *
 * Deux cas de figure :
 *  1. Pages d'authentification (connexion, inscription) → pas de Sidebar,
 *     pas de protection (l'utilisateur n'est pas encore connecté).
 *  2. Toutes les autres pages → protégées par <ProtectedRoute />, avec Sidebar.
 *
 * Note : la protection est côté client (Option A). Le backend rejette
 * de toute façon les requêtes sans JWT valide.
 */
export default function ProprietaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Détection des pages d'authentification
  const estPageAuth =
    pathname === "/proprietaire/connexion" ||
    pathname === "/proprietaire/inscription";

  // Pages d'auth : rendu simple, sans Sidebar ni protection
  if (estPageAuth) {
    return <div className="min-h-screen bg-imo-light">{children}</div>;
  }

  // Pages protégées : Sidebar + zone de contenu
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-imo-light flex">
        <Sidebar />
        <main className="flex-1 min-w-0 pt-16 lg:pt-0">
          <div className="container-app py-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}