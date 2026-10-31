"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Phone, MapPin, Home } from "lucide-react";
import { useBiens } from "@/hooks/useBiens";
import { PropertyCard } from "@/components/public/PropertyCard";
import { MediaModal } from "@/components/public/MediaModal";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { BienReadDetail } from "@/types/bien";

const MOCK_BIENS: BienReadDetail[] = [
  {
    id: "mock-1",
    titre: "Belle maison 3 chambres à Pétion-Ville",
    description: "Magnifique maison avec jardin",
    type_operation: "VENTE" as any,
    type_location: null,
    prix: 250000,
    devise: "USD" as any,
    frequence_paiement: null,
    nombre_chambres: 3,
    nombre_salles_bain: 2,
    superficie_m2: 250,
    annee_construction: 2018,
    caracteristiques: null,
    statut: "DISPONIBLE" as any,
    est_actif: true,
    categorie_id: "cat-1",
    localisation_id: "loc-1",
    proprietaire_id: "prop-1",
    cree_le: new Date().toISOString(),
    categorie: { id: "cat-1", nom: "Maison", slug: "maison", ordre: 1, est_active: true } as any,
    localisation: { id: "loc-1", departement: "Ouest", commune: "Pétion-Ville", zone: "Pétion-Ville", adresse_descriptive: null } as any,
    medias: [{ id: "m1", bien_id: "mock-1", url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600", type: "PHOTO" as any, ordre: 0, est_couverture: true, cree_le: "" } as any],
  },
  {
    id: "mock-2",
    titre: "Appartement moderne à Delmas",
    description: "Appartement 2 chambres",
    type_operation: "LOCATION" as any,
    type_location: "APPARTEMENT" as any,
    prix: 1200,
    devise: "USD" as any,
    frequence_paiement: "MENSUEL" as any,
    nombre_chambres: 2,
    nombre_salles_bain: 1,
    superficie_m2: 85,
    annee_construction: 2021,
    caracteristiques: null,
    statut: "DISPONIBLE" as any,
    est_actif: true,
    categorie_id: "cat-2",
    localisation_id: "loc-2",
    proprietaire_id: "prop-1",
    cree_le: new Date().toISOString(),
    categorie: { id: "cat-2", nom: "Appartement", slug: "appartement", ordre: 2, est_active: true } as any,
    localisation: { id: "loc-2", departement: "Ouest", commune: "Port-au-Prince", zone: "Delmas", adresse_descriptive: null } as any,
    medias: [{ id: "m2", bien_id: "mock-2", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600", type: "PHOTO" as any, ordre: 0, est_couverture: true, cree_le: "" } as any],
  },
];

export default function AccueilPage() {
  const { data, isLoading, error } = useBiens({ taille: 12, page: 1 });
  const [modalSrc, setModalSrc] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"image" | "video">("image");

  const biens = data?.items && data.items.length > 0 ? data.items : MOCK_BIENS;

  const openMedia = (src: string, type: "image" | "video") => {
    setModalSrc(src);
    setModalType(type);
  };

  const closeModal = () => setModalSrc(null);

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-imo-dark via-imo-dark to-imo-green text-white py-20 px-4">
        <div className="container-app">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Trouvez votre bien idéal en Haïti
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-300 max-w-2xl"
          >
            Maisons, appartements, terrains et locaux commerciaux disponibles à la vente et à la location.
          </motion.p>
        </div>
      </section>

      <section className="container-app py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-[70%]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-imo-dark">Derniers biens publiés</h2>
              <Link href="/biens" className="text-sm font-semibold text-imo-green hover:underline">
                Voir tout →
              </Link>
            </div>
            {isLoading && (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="break-inside-avoid mb-4 rounded-xl overflow-hidden border border-imo-gray bg-white">
                    <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            {!isLoading && (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                {biens.map((bien, i) => (
                  <div key={bien.id} className="break-inside-avoid mb-4">
                    <PropertyCard bien={bien} onOpenMedia={openMedia} index={i} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="lg:w-[30%] space-y-6">
            <div className="bg-white rounded-xl border border-imo-gray shadow-card p-5 sticky top-24">
              <h3 className="font-bold text-imo-dark mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} /> Filtres rapides
              </h3>
              <div className="space-y-3">
                <select className="w-full px-3 py-2 border border-imo-gray rounded-lg text-sm">
                  <option value="">Type de bien</option>
                  <option value="VENTE">À vendre</option>
                  <option value="LOCATION">À louer</option>
                </select>
                <select className="w-full px-3 py-2 border border-imo-gray rounded-lg text-sm">
                  <option value="">Localisation</option>
                  <option value="ouest">Ouest</option>
                  <option value="nord">Nord</option>
                  <option value="sud">Sud</option>
                </select>
                <input
                  type="number"
                  placeholder="Prix max"
                  className="w-full px-3 py-2 border border-imo-gray rounded-lg text-sm"
                />
                <Link
                  href="/biens"
                  className="block w-full text-center bg-imo-green hover:bg-imo-green-600 text-white text-sm font-semibold py-2 rounded-lg transition"
                >
                  <Search size={14} className="inline mr-1" /> Rechercher
                </Link>
              </div>
            </div>

            <div className="bg-imo-dark text-white rounded-xl p-5 shadow-card">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Phone size={16} /> Contactez-nous
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Besoin d'aide pour trouver votre bien ? Notre équipe est disponible.
              </p>
              <a
                href="tel:+50936000000"
                className="block w-full text-center bg-imo-yellow hover:bg-imo-yellow-dark text-imo-dark text-sm font-bold py-2 rounded-lg transition"
              >
                Appeler maintenant
              </a>
              <a
                href="mailto:contact@imolakaya.com"
                className="block w-full text-center mt-2 text-sm text-imo-green hover:underline"
              >
                contact@imolakaya.com
              </a>
            </div>

            <div className="bg-imo-yellow rounded-xl p-5 text-center">
              <Home size={28} className="mx-auto mb-2 text-imo-dark" />
              <h3 className="font-bold text-imo-dark mb-1">Vous avez un bien ?</h3>
              <p className="text-xs text-imo-dark/80 mb-3">
                Publiez votre annonce gratuitement.
              </p>
              <Link
                href="/proprietaire/inscription"
                className="inline-block bg-imo-dark text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-imo-dark/80 transition"
              >
                Publier mon bien
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {modalSrc && (
        <MediaModal
          src={modalSrc}
          type={modalType}
          open={!!modalSrc}
          onClose={closeModal}
        />
      )}
    </div>
  );
}