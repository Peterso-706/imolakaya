"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "./LoadingSpinner";
import { Roles } from "@/utils/constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermission?: string;
}

export const ProtectedRoute = ({ children, requiredRoles, requiredPermission }: ProtectedRouteProps) => {
  const { user, isAuthenticated, hasRole, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/proprietaire/connexion");
      return;
    }
    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.some((role) => hasRole(role))) {
        // Rediriger vers l'espace correspondant au rôle
        if (hasRole(Roles.ADMIN) || hasRole(Roles.ADMIN_PRINCIPAL)) {
          router.push("/admin/dashboard");
        } else if (hasRole(Roles.PROPRIETAIRE)) {
          router.push("/proprietaire/dashboard");
        } else {
          router.push("/");
        }
        return;
      }
    }
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push("/");
    }
  }, [isAuthenticated, user, requiredRoles, requiredPermission, router, hasRole, hasPermission]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-imo-light">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  return <>{children}</>;
};