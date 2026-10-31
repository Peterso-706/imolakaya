"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, User as UserIcon } from "lucide-react";
import { changePasswordSchema, ChangePasswordFormData } from "@/forms/auth.schema";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { getErrorMessage } from "@/utils/errors";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";

export default function ProfilPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.changerMotDePasse({
        ancien_mot_de_passe: data.ancien_mot_de_passe,
        nouveau_mot_de_passe: data.nouveau_mot_de_passe,
      });
      showToast("Mot de passe modifié avec succès", "success");
      reset();
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      showToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-imo-dark">Mon profil</h1>
        <p className="text-sm text-gray-600">Gérez vos informations personnelles et votre sécurité.</p>
      </div>

      {/* Informations du compte (lecture seule) */}
      <div className="bg-white rounded-lg border border-imo-gray p-5 space-y-4">
        <h2 className="font-bold text-imo-dark text-lg border-b border-imo-gray pb-3 flex items-center gap-2">
          <UserIcon size={18} /> Informations du compte
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-3 py-1">
            <span className="text-gray-600">Identifiant :</span>
            <span className="font-mono text-imo-dark text-xs truncate">{user?.sub}</span>
          </div>
          <div className="flex justify-between gap-3 py-1">
            <span className="text-gray-600">Rôles :</span>
            <span className="font-semibold text-imo-dark">
              {user?.roles?.join(", ") || "—"}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500 bg-imo-light p-3 rounded">
          Pour modifier votre email ou téléphone, contactez l&apos;administration.
        </p>
      </div>

      {/* Changement de mot de passe */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg border border-imo-gray p-5 space-y-4"
      >
        <h2 className="font-bold text-imo-dark text-lg border-b border-imo-gray pb-3 flex items-center gap-2">
          <KeyRound size={18} /> Changer de mot de passe
        </h2>

        <Input
          label="Ancien mot de passe *"
          type="password"
          placeholder="••••••••"
          error={errors.ancien_mot_de_passe?.message}
          {...register("ancien_mot_de_passe")}
        />

        <Input
          label="Nouveau mot de passe *"
          type="password"
          placeholder="Minimum 8 caractères"
          error={errors.nouveau_mot_de_passe?.message}
          {...register("nouveau_mot_de_passe")}
        />

        <Input
          label="Confirmer le nouveau mot de passe *"
          type="password"
          placeholder="Retapez le mot de passe"
          error={errors.confirmation?.message}
          {...register("confirmation")}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <Button type="submit" variant="primary" isLoading={isLoading}>
          Enregistrer le nouveau mot de passe
        </Button>
      </form>
    </div>
  );
}