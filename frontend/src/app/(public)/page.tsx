// frontend/src/app/(public)/page.tsx
"use client";

import Link from "next/link";
import Hero from "@/components/public/Hero";
import StatsSection from "@/components/public/StatsSection";
import { PropertyGrid } from "@/components/public/PropertyGrid";
import { useBiens } from "@/hooks/useBiens";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function AccueilPage() {
  const { data, isLoading, error } = useBiens({ taille: 8, page: 1 });

  return (
    <div>
      <Hero />
      <StatsSection />

      <section className="container-app py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-imo-dark">Derniers biens publiés</h2>
            <p className="text-sm text-gray-600">Découvrez les dernières propriétés ajoutées sur la plateforme.</p>
          </div>
          <Link href="/biens" className="text-sm font-semibold text-imo-green hover:underline whitespace-nowrap ml-4">
            Voir tout →
          </Link>
        </div>

        {isLoading && <LoadingSpinner size="lg" />}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {!isLoading && !error && data && (
          <PropertyGrid
            biens={data.items}
            emptyTitle="Aucun bien pour le moment"
            emptyDescription="Les premières annonces apparaîtront ici dès leur publication."
          />
        )}
      </section>

      <section className="bg-imo-dark text-white py-16">
        <div className="container-app text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Vous avez un bien à vendre ou à louer ?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Publiez votre annonce gratuitement et atteignez des milliers de visiteurs potentiels en Haïti.
          </p>
          <Link
            href="/proprietaire/inscription"
            className="inline-block bg-imo-yellow hover:bg-imo-yellow-dark text-imo-dark px-8 py-3 rounded-lg font-bold transition"
          >
            Publier mon bien
          </Link>
        </div>
      </section>
    </div>
  );
}