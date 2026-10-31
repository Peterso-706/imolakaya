import Link from "next/link";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import { BienReadDetail } from "@/types/bien";
import { formatPrix } from "@/utils/format";
import { Badge } from "@/components/shared/Badge";

interface PropertyCardProps {
  bien: BienReadDetail;
}

export const PropertyCard = ({ bien }: PropertyCardProps) => {
  const couverture = bien.medias?.find((m) => m.est_couverture) || bien.medias?.[0];
  const imageUrl = couverture?.url || "/images/placeholder-bien.jpg";

  const badgeVariant =
    bien.type_operation === "VENTE" ? "warning" : "success";

  return (
    <Link href={`/biens/${bien.id}`} className="group block">
      <article className="bg-white rounded-lg overflow-hidden border border-imo-gray shadow-card hover:shadow-pop transition-shadow">
        <div className="relative aspect-[4/3] bg-imo-gray-light overflow-hidden">
          <img
            src={imageUrl}
            alt={bien.titre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <Badge variant={badgeVariant}>
              {bien.type_operation === "VENTE" ? "À vendre" : "À louer"}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-imo-dark text-lg line-clamp-1 mb-1">{bien.titre}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
            <MapPin size={14} />
            {bien.localisation?.commune}, {bien.localisation?.departement}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
            {bien.nombre_chambres != null && (
              <span className="flex items-center gap-1"><Bed size={14} />{bien.nombre_chambres}</span>
            )}
            {bien.nombre_salles_bain != null && (
              <span className="flex items-center gap-1"><Bath size={14} />{bien.nombre_salles_bain}</span>
            )}
            {bien.superficie_m2 != null && (
              <span className="flex items-center gap-1"><Maximize size={14} />{bien.superficie_m2} m²</span>
            )}
          </div>
          <div className="pt-3 border-t border-imo-gray">
            <span className="text-lg font-bold text-imo-green">
              {formatPrix(Number(bien.prix), bien.devise as any)}
            </span>
            {bien.frequence_paiement && (
              <span className="text-xs text-gray-500 ml-1">/ {bien.frequence_paiement.toLowerCase()}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};