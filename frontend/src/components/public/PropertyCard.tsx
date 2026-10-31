"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Maximize, Phone, Eye, Heart, Play } from "lucide-react";
import { BienReadDetail } from "@/types/bien";
import { formatPrix } from "@/utils/format";
import { Badge } from "@/components/shared/Badge";

interface PropertyCardProps {
  bien: BienReadDetail;
  onOpenMedia?: (src: string, type: "image" | "video") => void;
  index?: number;
}

const STATUS_CONFIG: Record<string, { label: string; variant: "success" | "warning" | "info" | "default" }> = {
  DISPONIBLE: { label: "Disponib", variant: "success" },
  VENDU: { label: "Vann", variant: "warning" },
  LOUE: { label: "Lwe", variant: "info" },
  RESERVE: { label: "Rezève", variant: "default" },
};

export const PropertyCard = ({ bien, onOpenMedia, index = 0 }: PropertyCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imgError, setImgError] = useState(false);
  const [liked, setLiked] = useState(false);

  const couverture = bien.medias?.find((m) => m.est_couverture) || bien.medias?.[0];
  const isVideo = couverture?.type === "VIDEO";
  const mediaUrl = couverture?.url || "/images/placeholder-bien.jpg";

  const status = STATUS_CONFIG[bien.statut] || { label: bien.statut, variant: "default" as const };

  const handleMouseEnter = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleMediaClick = () => {
    if (onOpenMedia && mediaUrl && mediaUrl !== "/images/placeholder-bien.jpg") {
      onOpenMedia(mediaUrl, isVideo ? "video" : "image");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.15)" }}
      className="bg-white rounded-xl overflow-hidden border border-imo-gray shadow-card transition-shadow"
    >
      <div
        className="relative aspect-[4/3] bg-imo-gray-light overflow-hidden cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleMediaClick}
      >
        {isVideo ? (
          <video
            ref={videoRef}
            src={mediaUrl}
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : imgError ? (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        ) : (
          <img
            src={mediaUrl}
            alt={bien.titre}
            className="w-full h-full object-cover transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}

        <div className="absolute top-3 left-3">
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition"
        >
          <Heart size={16} className={liked ? "fill-red-500 text-red-500" : "text-gray-600"} />
        </button>

        {isVideo && (
          <div className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/50 text-white">
            <Play size={14} />
          </div>
        )}
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

        <div className="pt-3 border-t border-imo-gray flex items-center justify-between">
          <span className="text-lg font-bold text-imo-green">
            {formatPrix(Number(bien.prix), bien.devise as any)}
          </span>
          {bien.frequence_paiement && (
            <span className="text-xs text-gray-500">/ {bien.frequence_paiement.toLowerCase()}</span>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <Link
            href={`/biens/${bien.id}`}
            className="flex-1 text-center bg-imo-green hover:bg-imo-green-600 text-white text-sm font-semibold py-2 rounded-lg transition"
          >
            <Eye size={14} className="inline mr-1" /> Wè Detay
          </Link>
          <button className="flex items-center justify-center gap-1 text-sm font-semibold py-2 px-3 rounded-lg border border-imo-gray hover:bg-imo-light transition">
            <Phone size={14} /> Kontakte
          </button>
        </div>
      </div>
    </motion.article>
  );
};