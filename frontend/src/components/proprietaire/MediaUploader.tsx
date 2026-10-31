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

const MAX_IMAGES = 3;
const MAX_VIDEOS = 2;

export const MediaUploader = ({ bienId, medias, onRefresh }: MediaUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isUploadingVideos, setIsUploadingVideos] = useState(false);
  const [progressImages, setProgressImages] = useState({ done: 0, total: 0 });
  const [progressVideos, setProgressVideos] = useState({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const inputImagesRef = useRef<HTMLInputElement>(null);
  const inputVideosRef = useRef<HTMLInputElement>(null);

  const imagesCount = medias.filter((m) => m.type === TypeMedia.PHOTO).length;
  const videosCount = medias.filter((m) => m.type === TypeMedia.VIDEO).length;

  const handleFiles = async (files: FileList | null, kind: "image" | "video") => {
    if (!files || files.length === 0) return;

    const acceptes = Array.from(files).filter((f) =>
      kind === "image" ? f.type.startsWith("image/") : f.type.startsWith("video/")
    );

    if (acceptes.length === 0) {
      setError(
        kind === "image"
          ? "Formats d'images acceptes : JPG, PNG, WEBP."
          : "Formats de videos acceptes : MP4, WEBM."
      );
      return;
    }

    if (kind === "image") {
      if (imagesCount + acceptes.length > MAX_IMAGES) {
        setError(
          `Maximum ${MAX_IMAGES} images autorisees (${imagesCount} deja presentes, ${acceptes.length} selectionnees).`
        );
        return;
      }
    } else {
      if (videosCount + acceptes.length > MAX_VIDEOS) {
        setError(
          `Maximum ${MAX_VIDEOS} videos autorisees (${videosCount} deja presentes, ${acceptes.length} selectionnees).`
        );
        return;
      }
    }

    if (kind === "image") {
      setIsUploadingImages(true);
      setProgressImages({ done: 0, total: acceptes.length });
    } else {
      setIsUploadingVideos(true);
      setProgressVideos({ done: 0, total: acceptes.length });
    }
    setError(null);

    const hasCover = medias.some((m) => m.est_couverture);

    for (let i = 0; i < acceptes.length; i++) {
      try {
        const isCover = !hasCover && i === 0 && kind === "image";
        await mediasService.uploader(bienId, acceptes[i], isCover);
        if (kind === "image") {
          setProgressImages((prev) => ({ ...prev, done: prev.done + 1 }));
        } else {
          setProgressVideos((prev) => ({ ...prev, done: prev.done + 1 }));
        }
      } catch (err: any) {
        setError(err.message || "Erreur lors du televersement");
      }
    }

    if (kind === "image") setIsUploadingImages(false);
    else setIsUploadingVideos(false);
    if (kind === "image" && inputImagesRef.current) inputImagesRef.current.value = "";
    if (kind === "video" && inputVideosRef.current) inputVideosRef.current.value = "";
    onRefresh();
  };

  const supprimer = async (mediaId: string) => {
    if (!confirm("Supprimer ce media ?")) return;
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
    <div className="space-y-6">
      {/* Upload images */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files, "image");
        }}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
          isDragging ? "border-imo-green bg-imo-green-50" : "border-imo-gray bg-white"
        }`}
      >
        <input
          ref={inputImagesRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files, "image")}
        />
        <ImageIcon className="mx-auto mb-2 text-gray-300" size={28} />
        <p className="text-sm font-medium text-imo-dark mb-1">Images</p>
        <p className="text-xs text-gray-500 mb-3">
          JPG, PNG, WEBP — max {MAX_IMAGES} images ({imagesCount} deja presentes)
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => inputImagesRef.current?.click()}
          disabled={isUploadingImages || imagesCount >= MAX_IMAGES}
        >
          <Upload size={14} className="mr-1" /> Ajouter des images
        </Button>

        {isUploadingImages && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-imo-green">
              <span>Televersement images...</span>
              <span>
                {progressImages.done}/{progressImages.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-imo-green h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    progressImages.total > 0
                      ? Math.round((progressImages.done / progressImages.total) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Upload videos */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files, "video");
        }}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
          isDragging ? "border-imo-green bg-imo-green-50" : "border-imo-gray bg-white"
        }`}
      >
        <input
          ref={inputVideosRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files, "video")}
        />
        <Video className="mx-auto mb-2 text-gray-300" size={28} />
        <p className="text-sm font-medium text-imo-dark mb-1">Videos</p>
        <p className="text-xs text-gray-500 mb-3">
          MP4, WEBM — max {MAX_VIDEOS} videos ({videosCount} deja presentes)
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => inputVideosRef.current?.click()}
          disabled={isUploadingVideos || videosCount >= MAX_VIDEOS}
        >
          <Upload size={14} className="mr-1" /> Ajouter des videos
        </Button>

        {isUploadingVideos && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-imo-green">
              <span>Televersement videos...</span>
              <span>
                {progressVideos.done}/{progressVideos.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-imo-green h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    progressVideos.total > 0
                      ? Math.round((progressVideos.done / progressVideos.total) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
      {/* Grille des medias existants */}
      {medias.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-imo-dark mb-3">
            Medias existants ({medias.length})
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

      {medias.length === 0 && !isUploadingImages && !isUploadingVideos && (
        <div className="text-center py-8 text-sm text-gray-500">
          <ImageIcon className="mx-auto mb-2 text-gray-300" size={32} />
          Aucun media pour ce bien. Ajoutez au moins une photo de couverture.
        </div>
      )}
    </div>
  );
};