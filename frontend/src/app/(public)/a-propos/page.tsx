import Link from "next/link";

export default function AProposPage() {
  return (
    <div className="container-app py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-imo-dark mb-6">À propos d&apos;ImoLakaya</h1>
        <div className="prose prose-gray max-w-none space-y-4 text-gray-700">
          <p>
            <strong>ImoLakaya</strong> est la plateforme numérique de référence pour la publication
            et la gestion immobilière en Haïti. Notre mission est de faciliter la mise en relation
            entre propriétaires, agences et futurs locataires ou acquéreurs.
          </p>
          <p>
            Nous permettons à chacun de consulter des annonces vérifiées, de publier ses biens
            en ligne, et de gérer efficacement les demandes de contact — le tout depuis une
            interface moderne, accessible sur ordinateur, tablette et téléphone.
          </p>
          <h2 className="text-2xl font-bold text-imo-dark mt-8 mb-3">Nos engagements</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Centraliser les offres de vente et de location en Haïti.</li>
            <li>Contrôler chaque annonce avant sa publication publique.</li>
            <li>Assurer la confidentialité des coordonnées personnelles.</li>
            <li>Offrir une expérience adaptée à tous les écrans.</li>
            <li>Présenter des statistiques réelles, jamais fictives.</li>
          </ul>
          <h2 className="text-2xl font-bold text-imo-dark mt-8 mb-3">Contact</h2>
          <p>
            Une question ? Rendez-vous sur notre <Link href="/contact" className="text-imo-green font-semibold hover:underline">page de contact</Link> ou écrivez-nous à <strong>contact@imolakaya.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}