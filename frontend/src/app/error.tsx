// frontend/src/app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log de l'erreur (console pour le développement)
    console.error("Erreur de l'application :", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-imoLight px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-imoDark mb-4">Oups !</h1>
        <h2 className="text-xl font-semibold text-imoDark mb-2">
          Une erreur est survenue
        </h2>
        <p className="text-gray-600 mb-8">
          {error.message || "Quelque chose s'est mal passé. Veuillez réessayer."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-imoGreen hover:bg-opacity-90 text-white px-6 py-3 rounded-md font-semibold transition"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="bg-imoDark hover:bg-opacity-90 text-white px-6 py-3 rounded-md font-semibold transition text-center"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}