import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-imo-dark text-gray-300 py-10 mt-auto">
      <div className="container-app grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-imo-green mb-4">ImoLakaya</h3>
          <p className="text-sm leading-relaxed">
            La plateforme numérique de référence pour la publication et la gestion immobilière en Haïti.
            Trouvez, louez ou vendez votre bien en toute simplicité.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Liens rapides</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/biens" className="hover:text-imo-green transition">Tous les biens</Link></li>
            <li><Link href="/rechercher" className="hover:text-imo-green transition">Rechercher un bien</Link></li>
            <li><Link href="/a-propos" className="hover:text-imo-green transition">À propos</Link></li>
            <li><Link href="/contact" className="hover:text-imo-green transition">Nous contacter</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>Port-au-Prince, Haïti</li>
            <li>Email : contact@imolakaya.com</li>
            <li>Tél : +509 XXXX-XXXX</li>
          </ul>
        </div>
      </div>
      <div className="container-app mt-8 pt-8 border-t border-imo-green-800 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} ImoLakaya. Tous droits réservés.</p>
      </div>
    </footer>
  );
}