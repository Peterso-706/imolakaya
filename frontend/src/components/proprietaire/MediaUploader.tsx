"use client";

import { useRef, useState } from "react";
import { Upload, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Video, Star } from "lucide-react";
import { MediaRead } from "@/types/media";
import { TypeMedia } from "@/types/enums";
import { mediasService } from "@/services/medias.service";
import { Button } from "@/components/shared/Button";

interface MediaUploaderProps {
  bienId: string;
  medias: MediaRead[];
  onRefresh: () => void;
}

export const MediaUploader = ({ bienId, medias, onRefresh }: MediaUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const acceptes = Array.from(files).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );

    if (acceptes.length === 0) {
      setError("Formats acceptés : images et vidéos uniquement.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgress({ done: 0, total: acceptes.length });

    const hasCover = medias.some((m) => m.est_couverture);

    for (let i = 0; i < acceptes.length; i++) {
      try {
        // Le premier upload devient la couverture si aucune n'existe déjà
        const isCover = !hasCover && i === 0;
        await mediasService.uploader(bienId, acceptes[i], isCover);
        setProgress((prev) => ({ ...prev, done: prev.done + 1 }));
      } catch (err: any) {
        setError(err.message || "Erreur lors du téléversement");
      }
    }

    setIsUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    onRefresh();
  };

  const supprimer = async (mediaId: string) => {
    if (!confirm("Supprimer ce média ?")) return;
    try {
      await mediasService.supprimer(mediaId);
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deplacer = async (index: number, direction: -1 | 1) => {
    const toIndex = index + direction;
    if (toIndex < 0 || toIndex >= medias.length) return;

    const reordered = [...medias];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(toIndex, 0, moved);

    try {
      await mediasService.reordonner(bienId, {
        items: reordered.map((m, i) => ({ id: m.id, ordre: i })),
      });
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Zone de dépôt */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
          isDragging ? "border-imo-green bg-imo-green-50" : "border-imo-gray bg-white"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload className="mx-auto mb-3 text-imo-green" size={32} />
        <p className="text-sm font-medium text-imo-dark mb-1">
          Glissez vos fichiers ici, ou cliquez pour sélectionner
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Images (JPG, PNG, WEBP) et vidéos (MP4) acceptées
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          Choisir des fichiers
        </Button>

        {isUploading && (
          <p className="text-xs text-imo-green mt-3">
            Téléversement en cours... {progress.done}/{progress.total}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Grille des médias existants */}
      {medias.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-imo-dark mb-3">
            Médias existants ({medias.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {medias.map((media, index) => (
              <div key={media.id} className="relative group rounded-lg overflow-hidden border border-imo-gray bg-white">
                <div className="aspect-square bg-imo-gray-light">
                  {media.type === TypeMedia.VIDEO ? (
                    <div className="w-full h-full flex items-center justify-center bg-imo-dark text-white">
                      <Video size={32} />
                    </div>
                  ) : (
                    <img src={media.url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>

                {media.est_couverture && (
                  <div className="absolute top-1.5 left-1.5 bg-imo-yellow text-imo-dark text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Star size={10} /> Couverture
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => deplacer(index, -1)}
                    disabled={index === 0}
                    className="p-1 text-white hover:bg-white/20 rounded disabled:opacity-30"
                    title="Reculer"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => deplacer(index, 1)}
                    disabled={index === medias.length - 1}
                    className="p-1 text-white hover:bg-white/20 rounded disabled:opacity-30"
                    title="Avancer"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => supprimer(media.id)}
                    className="p-1 text-red-400 hover:bg-red-500 hover:text-white rounded"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {medias.length === 0 && !isUploading && (
        <div className="text-center py-8 text-sm text-gray-500">
          <ImageIcon className="mx-auto mb-2 text-gray-300" size={32} />
          Aucun média pour ce bien. Ajoutez au moins une photo de couverture.
        </div>
      )}
    </div>
  );
};