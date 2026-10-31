import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container-app py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-imo-dark mb-2">Nous contacter</h1>
        <p className="text-gray-600 mb-8">
          Une question, une suggestion ou un problème ? Notre équipe vous répond dans les meilleurs délais.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-lg border border-imo-gray p-5 text-center">
            <Mail className="mx-auto mb-2 text-imo-green" size={24} />
            <h3 className="font-semibold text-imo-dark mb-1">Email</h3>
            <p className="text-sm text-gray-600">contact@imolakaya.com</p>
          </div>
          <div className="bg-white rounded-lg border border-imo-gray p-5 text-center">
            <Phone className="mx-auto mb-2 text-imo-green" size={24} />
            <h3 className="font-semibold text-imo-dark mb-1">Téléphone</h3>
            <p className="text-sm text-gray-600">+509 XXXX-XXXX</p>
          </div>
          <div className="bg-white rounded-lg border border-imo-gray p-5 text-center">
            <MapPin className="mx-auto mb-2 text-imo-green" size={24} />
            <h3 className="font-semibold text-imo-dark mb-1">Adresse</h3>
            <p className="text-sm text-gray-600">Port-au-Prince, Haïti</p>
          </div>
        </div>

        <div className="bg-imo-light rounded-lg border border-imo-gray p-6 text-sm text-gray-700">
          <p className="mb-2">
            <strong>Vous cherchez à contacter un propriétaire ?</strong>
          </p>
          <p>
            Rendez-vous sur la fiche du bien qui vous intéresse et utilisez le formulaire de contact
            intégré pour joindre directement le propriétaire.
          </p>
        </div>
      </div>
    </div>
  );
}