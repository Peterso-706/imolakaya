// frontend/src/app/loading.tsx
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-imoLight">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-imoDark font-medium">Chargement en cours...</p>
    </div>
  );
}