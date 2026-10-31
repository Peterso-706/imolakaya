"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Bed, Bath, Maximize, Calendar, Tag } from "lucide-react";
import { biensService } from "@/services/biens.service";
import { BienReadDetail } from "@/types/bien";
import { PropertyGallery } from "@/components/public/PropertyGallery";
import { ContactForm } from "@/components/public/ContactForm";
import { Badge } from "@/components/shared/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useVisite } from "@/hooks/useVisite";
import { formatPrix, formatDate } from "@/utils/format";

export default function BienDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [bien, setBien] = useState<BienReadDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useVisite(params?.id || null);

  useEffect(() => {
    if (!params?.id) return;
    (async () => {
      try {
        const data = await biensService.getDetail(params.id);
        setBien(data);
      } catch {
        setError("Bien introuvable ou indisponible.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !bien) {
    return (
      <div className="container-app py-16 text-center">
        <h1 className="text-2xl font-bold text-imo-dark mb-4">Bien introuvable</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <button onClick={() => router.push("/biens")} className="bg-imo-green text-white px-6 py-2 rounded-lg font-semibold">
          Retour aux biens
        </button>
      </div>
    );
  }

  const badgeVariant = bien.type_operation === "VENTE" ? "warning" : "success";

  return (
    <div className="container-app py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          <PropertyGallery medias={bien.medias} titre={bien.titre} />

          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Badge variant={badgeVariant}>
                {bien.type_operation === "VENTE" ? "À vendre" : "À louer"}
              </Badge>
              {bien.statut && <Badge variant="info">{bien.statut}</Badge>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-imo-dark mb-2">{bien.titre}</h1>
            <p className="text-gray-600 flex items-center gap-1 mb-4">
              <MapPin size={16} />
              {bien.localisation?.zone}, {bien.localisation?.commune}, {bien.localisation?.departement}
            </p>
            <div className="text-3xl font-bold text-imo-green mb-4">
              {formatPrix(Number(bien.prix), bien.devise as any)}
              {bien.frequence_paiement && (
                <span className="text-base text-gray-500 font-normal ml-1">
                  / {bien.frequence_paiement.toLowerCase()}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {bien.nombre_chambres != null && (
                <div className="bg-white rounded-lg border border-imo-gray p-3 text-center">
                  <Bed className="mx-auto mb-1 text-imo-green" size={20} />
                  <div className="text-lg font-bold text-imo-dark">{bien.nombre_chambres}</div>
                  <div className="text-xs text-gray-600">Chambres</div>
                </div>
              )}
              {bien.nombre_salles_bain != null && (
                <div className="bg-white rounded-lg border border-imo-gray p-3 text-center">
                  <Bath className="mx-auto mb-1 text-imo-green" size={20} />
                  <div className="text-lg font-bold text-imo-dark">{bien.nombre_salles_bain}</div>
                  <div className="text-xs text-gray-600">Salles de bain</div>
                </div>
              )}
              {bien.superficie_m2 != null && (
                <div className="bg-white rounded-lg border border-imo-gray p-3 text-center">
                  <Maximize className="mx-auto mb-1 text-imo-green" size={20} />
                  <div className="text-lg font-bold text-imo-dark">{bien.superficie_m2} m²</div>
                  <div className="text-xs text-gray-600">Superficie</div>
                </div>
              )}
              {bien.annee_construction != null && (
                <div className="bg-white rounded-lg border border-imo-gray p-3 text-center">
                  <Calendar className="mx-auto mb-1 text-imo-green" size={20} />
                  <div className="text-lg font-bold text-imo-dark">{bien.annee_construction}</div>
                  <div className="text-xs text-gray-600">Année</div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-imo-gray p-5">
              <h2 className="text-lg font-bold text-imo-dark mb-3 flex items-center gap-2">
                <Tag size={18} /> Description
              </h2>
              <p className="text-gray-700 whitespace-pre-line">{bien.description}</p>
            </div>

            {bien.caracteristiques && Object.keys(bien.caracteristiques).length > 0 && (
              <div className="bg-white rounded-lg border border-imo-gray p-5 mt-4">
                <h2 className="text-lg font-bold text-imo-dark mb-3">Caractéristiques</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                  {Object.entries(bien.caracteristiques).map(([key, value]) => (
                    <li key={key} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-imo-green" />
                      <strong>{key} :</strong> {String(value)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4">
              Publié le {formatDate(bien.cree_le)}
            </p>
          </div>
        </div>

        {/* Colonne latérale — Contact */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-imo-gray shadow-card p-5 sticky top-20">
            <ContactForm bienId={bien.id} bienTitre={bien.titre} />
          </div>
        </div>
      </div>
    </div>
  );
}