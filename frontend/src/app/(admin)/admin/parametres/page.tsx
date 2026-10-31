"use client";

import { Info, Settings, Shield, CreditCard, Database, Mail } from "lucide-react";

export default function AdminParametresPage() {
  const sections = [
    {
      icon: Shield,
      titre: "Sécurité",
      description: "Politique de mots de passe, durée de session, règles d'authentification.",
      items: [
        { label: "Longueur minimale du mot de passe", value: "8 caractères" },
        { label: "Durée de validité du jeton JWT", value: "24 heures" },
        { label: "Rôles disponibles", value: "5 rôles" },
      ],
    },
    {
      icon: CreditCard,
      titre: "Paiements",
      description: "Fournisseurs configurés et intégrations actives.",
      items: [
        { label: "MonCash", value: "Configuré" },
        { label: "NatCash", value: "Configuré" },
        { label: "Carte bancaire", value: "Selon fournisseur" },
      ],
    },
    {
      icon: Database,
      titre: "Stockage",
      description: "Service de stockage externe pour les médias.",
      items: [
        { label: "Fournisseur", value: "Cloudinary / R2" },
        { label: "Dossier racine", value: "imolakaya" },
        { label: "Types acceptés", value: "Images, vidéos" },
      ],
    },
    {
      icon: Mail,
      titre: "Notifications",
      description: "Envoi d'emails et notifications.",
      items: [
        { label: "Fournisseur email", value: "Resend" },
        { label: "Notifications internes", value: "Activées" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-imo-dark">Paramètres</h1>
        <p className="text-sm text-gray-600">
          Configuration générale de la plateforme ImoLakaya.
        </p>
      </div>

      {/* Bandeau informatif */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 flex gap-3">
        <Info size={20} className="flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold mb-1">Information technique</p>
          <p>
            Aucun endpoint <code className="bg-white px-1 rounded">GET/PATCH /admin/parametres</code>{" "}
            n&apos;existe encore côté backend. Cette page présente les paramètres <strong>actuels</strong> en
            lecture seule. Pour rendre les paramètres modifiables, ajoutez un endpoint et un modèle
            de configuration en base.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.titre} className="bg-white rounded-lg border border-imo-gray p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-imo-green-50 flex items-center justify-center text-imo-green">
                  <Icon size={20} />
                </div>
                <h2 className="font-bold text-imo-dark">{section.titre}</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">{section.description}</p>
              <ul className="space-y-2 text-sm">
                {section.items.map((item, i) => (
                  <li key={i} className="flex justify-between gap-3 py-1.5 border-b border-imo-gray last:border-0">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold text-imo-dark text-right">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Note de version */}
      <div className="bg-imo-dark text-white rounded-lg p-5 flex items-center gap-3">
        <Settings size={24} className="text-imo-green flex-shrink-0" />
        <div>
          <p className="font-semibold">ImoLakaya — Version 1.0</p>
          <p className="text-sm text-gray-300">
            Spécification des exigences logicielles et dossier d&apos;architecture — 30 octobre 2026.
          </p>
        </div>
      </div>
    </div>
  );
}