// frontend/src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-imoLight px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-imoGreen mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-imoDark mb-4">
          Page introuvable
        </h2>
        <p className="text-gray-600 mb-8">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-imoGreen hover:bg-opacity-90 text-white px-6 py-3 rounded-md font-semibold transition text-center"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/biens"
            className="bg-imoDark hover:bg-opacity-90 text-white px-6 py-3 rounded-md font-semibold transition text-center"
          >
            Voir les biens
          </Link>
        </div>
      </div>
    </div>
  );
}