"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, ShieldAlert } from "lucide-react";
import { decodeJwt } from "jose";
import { loginSchema, LoginFormData } from "@/forms/auth.schema";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { getErrorMessage } from "@/utils/errors";
import { Roles } from "@/utils/constants";

export default function AdminConnexionPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      // Décoder le token pour vérifier le rôle AVANT d'accepter
      const decoded = decodeJwt<{ roles: string[] }>(response.access_token);
      const roles = decoded.roles || [];

      if (!roles.includes(Roles.ADMIN) && !roles.includes(Roles.ADMIN_PRINCIPAL)) {
        setError("Accès refusé : ce compte n'a pas les droits administrateur.");
        return;
      }

      login(response.access_token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-imo-dark mb-4">
            <ShieldAlert className="text-imo-green" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-imo-dark">Administration</h1>
          <p className="text-sm text-gray-600 mt-1">
            Accès réservé aux administrateurs
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg border border-imo-gray shadow-card p-6 space-y-4"
        >
          <Input
            label="Adresse email"
            type="email"
            placeholder="admin@imolakaya.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            error={errors.mot_de_passe?.message}
            {...register("mot_de_passe")}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
            <LogIn size={16} />
            Se connecter
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="hover:text-imo-green">← Retour au site public</Link>
        </p>
      </div>
    </div>
  );
}