"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { MediaRead } from "@/types/media";

interface PropertyGalleryProps {
  medias: MediaRead[];
  titre: string;
}

export const PropertyGallery = ({ medias, titre }: PropertyGalleryProps) => {
  const [index, setIndex] = useState(0);

  // Trier par ordre, couverture en premier
  const ordonnes = [...medias].sort((a, b) => {
    if (a.est_couverture) return -1;
    if (b.est_couverture) return 1;
    return a.ordre - b.ordre;
  });

  useEffect(() => {
    setIndex(0);
  }, [medias]);

  if (!ordonnes || ordonnes.length === 0) {
    return (
      <div className="aspect-video bg-imo-gray-light rounded-lg flex items-center justify-center text-gray-400">
        <span className="text-sm">Aucune image disponible</span>
      </div>
    );
  }

  const media = ordonnes[index];
  const precedent = () => setIndex((i) => (i - 1 + ordonnes.length) % ordonnes.length);
  const suivant = () => setIndex((i) => (i + 1) % ordonnes.length);

  return (
    <div className="space-y-3">
      <div className="relative aspect-video bg-imo-dark rounded-lg overflow-hidden">
        {media.type === "VIDEO" ? (
          <video
            key={media.id}
            src={media.url}
            controls
            className="w-full h-full object-contain"
            poster=""
          >
            Votre navigateur ne supporte pas la vidéo.
          </video>
        ) : (
          <img
            src={media.url}
            alt={`${titre} — image ${index + 1}`}
            className="w-full h-full object-cover"
          />
        )}

        {ordonnes.length > 1 && (
          <>
            <button
              onClick={precedent}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              aria-label="Image précédente"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={suivant}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              aria-label="Image suivante"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {index + 1} / {ordonnes.length}
            </div>
          </>
        )}
      </div>

      {/* Vignettes */}
      {ordonnes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ordonnes.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setIndex(i)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition ${
                i === index ? "border-imo-green" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {m.type === "VIDEO" ? (
                <div className="w-full h-full bg-imo-dark flex items-center justify-center text-white">
                  <Play size={20} />
                </div>
              ) : (
                <img src={m.url} alt={`Vignette ${i + 1}`} className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};