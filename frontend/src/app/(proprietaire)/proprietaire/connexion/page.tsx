"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { loginSchema, LoginFormData } from "@/forms/auth.schema";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { getErrorMessage } from "@/utils/errors";

export default function ConnexionPage() {
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
      login(response.access_token);
      router.push("/proprietaire/dashboard");
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
          <Link href="/" className="text-3xl font-bold text-imo-green">
            ImoLakaya
          </Link>
          <h1 className="text-2xl font-bold text-imo-dark mt-4">Connexion</h1>
          <p className="text-sm text-gray-600 mt-1">
            Accédez à votre espace propriétaire
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg border border-imo-gray shadow-card p-6 space-y-4"
        >
          <Input
            label="Adresse email"
            type="email"
            placeholder="vous@example.com"
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

          <p className="text-sm text-center text-gray-600 pt-2">
            Pas encore de compte ?{" "}
            <Link href="/proprietaire/inscription" className="text-imo-green font-semibold hover:underline">
              Créer un compte
            </Link>
          </p>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="hover:text-imo-green">← Retour à l&apos;accueil</Link>
        </p>
      </div>
    </div>
  );
}