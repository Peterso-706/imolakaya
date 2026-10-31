"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { registerSchema, RegisterFormData } from "@/forms/auth.schema";
import { authService } from "@/services/auth.service";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { getErrorMessage } from "@/utils/errors";

export default function InscriptionPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.inscription({
        email: data.email,
        mot_de_passe: data.mot_de_passe,
        nom: data.nom,
        prenom: data.prenom || null,
        telephone: data.telephone || null,
      });
      setIsSuccess(true);
      // Redirection après 2 secondes vers la connexion
      setTimeout(() => router.push("/proprietaire/connexion"), 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg border border-imo-gray shadow-card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-imo-green-100 flex items-center justify-center">
            <UserPlus size={28} className="text-imo-green" />
          </div>
          <h1 className="text-xl font-bold text-imo-dark mb-2">Compte créé !</h1>
          <p className="text-sm text-gray-600 mb-4">
            Votre compte propriétaire a bien été créé. Vous allez être redirigé vers la page de connexion.
          </p>
          <Link href="/proprietaire/connexion" className="text-imo-green font-semibold hover:underline text-sm">
            Aller à la connexion maintenant →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-imo-green">
            ImoLakaya
          </Link>
          <h1 className="text-2xl font-bold text-imo-dark mt-4">Créer un compte</h1>
          <p className="text-sm text-gray-600 mt-1">
            Rejoignez la plateforme et publiez vos biens
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg border border-imo-gray shadow-card p-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nom *"
              placeholder="Dupont"
              error={errors.nom?.message}
              {...register("nom")}
            />
            <Input
              label="Prénom"
              placeholder="Jean"
              error={errors.prenom?.message}
              {...register("prenom")}
            />
          </div>

          <Input
            label="Adresse email *"
            type="email"
            placeholder="vous@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Téléphone (optionnel)"
            type="tel"
            placeholder="+509 XXXX-XXXX"
            error={errors.telephone?.message}
            {...register("telephone")}
          />

          <Input
            label="Mot de passe *"
            type="password"
            placeholder="Minimum 8 caractères"
            error={errors.mot_de_passe?.message}
            {...register("mot_de_passe")}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
            <UserPlus size={16} />
            Créer mon compte
          </Button>

          <p className="text-sm text-center text-gray-600 pt-2">
            Déjà un compte ?{" "}
            <Link href="/proprietaire/connexion" className="text-imo-green font-semibold hover:underline">
              Se connecter
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