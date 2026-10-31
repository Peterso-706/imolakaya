"use client";

import { Building2, Megaphone, CreditCard, Eye, MessageSquare } from "lucide-react";
import { useRapports } from "@/hooks/useRapports";
import { KpiCard } from "@/components/admin/KpiCard";
import { RapportChart } from "@/components/admin/RapportChart";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function AdminRapportsPage() {
  const { stats, isLoading, error } = useRapports();

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  const donneesGraphique = [
    { label: "Biens", value: stats.biens_total },
    { label: "Annonces", value: stats.annonces_total },
    { label: "Paiements", value: stats.paiements_total },
    { label: "Visites", value: stats.visites_total },
    { label: "Contacts", value: stats.contacts_total },
  ];

  const totalActivite = donneesGraphique.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-imo-dark">Rapports</h1>
        <p className="text-sm text-gray-600">
          Vue statistique consolidée de l&apos;activité de la plateforme.
        </p>
      </div>

      {/* KPIs détaillés */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Biens" value={stats.biens_total} icon={<Building2 size={20} />} color="green" />
        <KpiCard label="Annonces" value={stats.annonces_total} icon={<Megaphone size={20} />} color="yellow" />
        <KpiCard label="Paiements" value={stats.paiements_total} icon={<CreditCard size={20} />} color="purple" />
        <KpiCard label="Visites" value={stats.visites_total} icon={<Eye size={20} />} color="blue" />
        <KpiCard label="Contacts" value={stats.contacts_total} icon={<MessageSquare size={20} />} color="red" />
      </div>

      {/* Graphique principal */}
      <RapportChart
        title={`Répartition de l'activité (${totalActivite} événements au total)`}
        data={donneesGraphique}
      />

      {/* Résumé */}
      <div className="bg-white rounded-lg border border-imo-gray p-5">
        <h3 className="font-bold text-imo-dark mb-3">Résumé</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex justify-between border-b border-imo-gray pb-2">
            <span>Ratio annonces / biens</span>
            <strong className="text-imo-dark">
              {stats.biens_total > 0
                ? `${(stats.annonces_total / stats.biens_total).toFixed(2)} annonce(s) par bien`
                : "—"}
            </strong>
          </li>
          <li className="flex justify-between border-b border-imo-gray pb-2">
            <span>Ratio visites / bien</span>
            <strong className="text-imo-dark">
              {stats.biens_total > 0
                ? `${(stats.visites_total / stats.biens_total).toFixed(1)} vue(s) par bien`
                : "—"}
            </strong>
          </li>
          <li className="flex justify-between">
            <span>Ratio contacts / bien</span>
            <strong className="text-imo-dark">
              {stats.biens_total > 0
                ? `${(stats.contacts_total / stats.biens_total).toFixed(2)} contact(s) par bien`
                : "—"}
            </strong>
          </li>
        </ul>
      </div>
    </div>
  );
}