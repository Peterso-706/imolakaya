"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { utilisateursService } from "@/services/utilisateurs.service";
import { UserForm } from "@/components/admin/UserForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/shared/Button";
import { useToast } from "@/contexts/ToastContext";
import { getErrorMessage } from "@/utils/errors";
import { UtilisateurRead, UtilisateurAdminUpdate } from "@/types/utilisateur";

export default function AdminUtilisateurDetailPage() {
  const params = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [utilisateur, setUtilisateur] = useState<UtilisateurRead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    (async () => {
      setIsLoading(true);
      try {
        // Pas de GET /admin/utilisateurs/{id} : on charge la 1ère page
        // et on filtre côté client. Si votre base est grande, ajoutez
        // un endpoint dédié côté backend.
        const response = await utilisateursService.lister(1, 100);
        const trouve = response.items.find((u) => u.id === params.id);
        if (!trouve) {
          setError("Utilisateur introuvable.");
        } else {
          setUtilisateur(trouve);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params?.id]);

  const enregistrer = async (payload: UtilisateurAdminUpdate) => {
    if (!params?.id) return;
    setIsSaving(true);
    try {
      await utilisateursService.modifier(params.id, payload);
      showToast("Utilisateur mis à jour", "success");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !utilisateur) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error || "Utilisateur introuvable"}</p>
        <Link href="/admin/utilisateurs">
          <Button variant="ghost">Retour aux utilisateurs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/utilisateurs"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-imo-green mb-3"
        >
          <ArrowLeft size={14} /> Retour aux utilisateurs
        </Link>
        <h1 className="text-2xl font-bold text-imo-dark">Modifier l&apos;utilisateur</h1>
        <p className="text-sm text-gray-600">{utilisateur.email}</p>
      </div>

      <UserForm
        mode="edition"
        initial={{
          email: utilisateur.email,
          nom: utilisateur.nom,
          prenom: utilisateur.prenom,
          telephone: utilisateur.telephone,
          est_actif: utilisateur.est_actif,
          est_verifie: utilisateur.est_verifie,
        }}
        onSubmitEdition={enregistrer}
        isLoading={isSaving}
      />
    </div>
  );
}