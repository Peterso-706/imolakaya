"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BienForm } from "@/components/proprietaire/BienForm";
import { biensService } from "@/services/biens.service";
import { useToast } from "@/contexts/ToastContext";
import { getErrorMessage } from "@/utils/errors";
import { BienCreateFormData } from "@/forms/bien.schema";

export default function NouveauBienPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: BienCreateFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const bien = await biensService.creer(data as any);
      showToast("Bien créé avec succès", "success");
      router.push(`/proprietaire/biens/${bien.id}/medias`);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      showToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/proprietaire/biens" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-imo-green mb-3">
          <ArrowLeft size={14} /> Retour à mes biens
        </Link>
        <h1 className="text-2xl font-bold text-imo-dark">Ajouter un nouveau bien</h1>
        <p className="text-sm text-gray-600">
          Remplissez les informations du bien. Vous pourrez ajouter des photos juste après.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <BienForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitLabel="Créer le bien"
      />
    </div>
  );
}