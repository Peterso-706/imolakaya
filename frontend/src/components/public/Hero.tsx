import Link from "next/link";
import { SearchBar } from "./SearchBar";

export default function Hero() {
  return (
    <section className="relative bg-imo-dark text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-imo-dark via-imo-green-900 to-imo-dark opacity-95" />
      <div className="container-app relative py-20 md:py-28 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          Trouvez votre <span className="text-imo-yellow">logement idéal</span> en Haïti
        </h1>
        <p className="text-base md:text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
          Des centaines de propriétés à louer ou à vendre. Recherchez par ville, prix et type de bien.
        </p>
        <div className="max-w-3xl mx-auto">
          <SearchBar />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/biens?type_operation=VENTE" className="bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-sm font-medium transition">
            🏠 Acheter
          </Link>
          <Link href="/biens?type_operation=LOCATION" className="bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-sm font-medium transition">
            🔑 Louer
          </Link>
          <Link href="/biens" className="bg-imo-green hover:bg-imo-green-600 px-4 py-2 rounded-lg text-sm font-semibold transition">
            Voir tous les biens
          </Link>
        </div>
      </div>
    </section>
  );
}