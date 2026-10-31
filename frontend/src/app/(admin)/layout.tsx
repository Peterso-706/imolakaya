"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { Roles } from "@/utils/constants";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const estPageAuth = pathname === "/admin/connexion";

  if (estPageAuth) {
    return <div className="min-h-screen bg-imo-light">{children}</div>;
  }

  return (
    <ProtectedRoute
      requiredRoles={[Roles.ADMIN, Roles.ADMIN_PRINCIPAL]}
    >
      <div className="min-h-screen bg-imo-light flex">
        <AdminSidebar />
        <main className="flex-1 pt-16 lg:pt-0">
          <div className="container-app py-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}