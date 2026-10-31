"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/proprietaire/Sidebar";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export default function ProprietaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Les pages de connexion et d'inscription ne doivent PAS être protégées ni avoir de sidebar
  const estPageAuth =
    pathname === "/proprietaire/connexion" || pathname === "/proprietaire/inscription";

  if (estPageAuth) {
    return <div className="min-h-screen bg-imo-light">{children}</div>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-imo-light flex">
        <Sidebar />
        <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
          <div className="container-app py-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}