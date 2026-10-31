"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { BienForm } from "@/components/proprietaire/BienForm";
import { biensService } from "@/services/biens.service";
import { BienRead } from "@/types/bien";
import { useToast } from "@/contexts/ToastContext";
import { getErrorMessage } from "@/utils/errors";
import { BienCreateFormData } from "@/forms/bien.schema";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/shared/Button";

export default function ModifierBienPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const [bien, setBien] = useState<BienRead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    (async () => {
      try {
        const data = await biensService.getMonBien(params.id);
        setBien(data);
      } catch {
        setError("Impossible de charger le bien.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params?.id]);

  const onSubmit = async (data: BienCreateFormData) => {
    if (!params?.id) return;
    setIsSaving(true);
    try {
      await biensService.modifier(params.id, data as any);
      showToast("Bien modifié avec succès", "success");
      router.push("/proprietaire/biens");
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

  if (error || !bien) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error || "Bien introuvable"}</p>
        <Link href="/proprietaire/biens">
          <Button variant="ghost">Retour à mes biens</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/proprietaire/biens" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-imo-green mb-3">
          <ArrowLeft size={14} /> Retour à mes biens
        </Link>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-imo-dark">Modifier le bien</h1>
            <p className="text-sm text-gray-600">{bien.titre}</p>
          </div>
          <Link href={`/proprietaire/biens/${bien.id}/medias`}>
            <Button variant="ghost" size="sm">
              <ImageIcon size={14} /> Gérer les médias
            </Button>
          </Link>
        </div>
      </div>

      <BienForm
        bienInitial={bien}
        onSubmit={onSubmit}
        isLoading={isSaving}
        submitLabel="Enregistrer les modifications"
      />
    </div>
  );
}