"use client";

import { Building2, Megaphone, CreditCard, Eye, MessageSquare } from "lucide-react";
import { useRapports } from "@/hooks/useRapports";
import { KpiCard } from "@/components/admin/KpiCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import Link from "next/link";

export default function AdminDashboardPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-imo-dark">Tableau de bord</h1>
        <p className="text-sm text-gray-600">
          Vue d&apos;ensemble de l&apos;activité de la plateforme ImoLakaya.
        </p>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Biens enregistrés"
          value={stats?.biens_total ?? 0}
          icon={<Building2 size={20} />}
          href="/admin/biens"
          color="green"
        />
        <KpiCard
          label="Annonces"
          value={stats?.annonces_total ?? 0}
          icon={<Megaphone size={20} />}
          href="/admin/annonces"
          color="yellow"
        />
        <KpiCard
          label="Paiements"
          value={stats?.paiements_total ?? 0}
          icon={<CreditCard size={20} />}
          href="/admin/paiements"
          color="purple"
        />
        <KpiCard
          label="Visites"
          value={stats?.visites_total ?? 0}
          icon={<Eye size={20} />}
          color="blue"
        />
      </div>

      {/* KPI secondaire */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          label="Contacts reçus"
          value={stats?.contacts_total ?? 0}
          icon={<MessageSquare size={20} />}
          color="red"
        />
      </div>

      {/* Accès rapides */}
      <div className="bg-white rounded-lg border border-imo-gray p-5">
        <h2 className="font-bold text-imo-dark mb-4">Accès rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/admin/annonces?statut=EN_ATTENTE"
            className="bg-imo-light hover:bg-imo-gray-light rounded-lg p-4 text-center transition"
          >
            <Megaphone className="mx-auto mb-2 text-imo-yellow-dark" size={24} />
            <p className="text-sm font-semibold text-imo-dark">Valider annonces</p>
            <p className="text-xs text-gray-500 mt-1">Annonces en attente</p>
          </Link>
          <Link
            href="/admin/utilisateurs"
            className="bg-imo-light hover:bg-imo-gray-light rounded-lg p-4 text-center transition"
          >
            <Building2 className="mx-auto mb-2 text-imo-green" size={24} />
            <p className="text-sm font-semibold text-imo-dark">Gérer utilisateurs</p>
            <p className="text-xs text-gray-500 mt-1">Créer, modifier</p>
          </Link>
          <Link
            href="/admin/paiements?statut=EN_ATTENTE"
            className="bg-imo-light hover:bg-imo-gray-light rounded-lg p-4 text-center transition"
          >
            <CreditCard className="mx-auto mb-2 text-purple-600" size={24} />
            <p className="text-sm font-semibold text-imo-dark">Vérifier paiements</p>
            <p className="text-xs text-gray-500 mt-1">Confirmations manuelles</p>
          </Link>
          <Link
            href="/admin/audit"
            className="bg-imo-light hover:bg-imo-gray-light rounded-lg p-4 text-center transition"
          >
            <Eye className="mx-auto mb-2 text-blue-600" size={24} />
            <p className="text-sm font-semibold text-imo-dark">Journal d&apos;audit</p>
            <p className="text-xs text-gray-500 mt-1">Actions sensibles</p>
          </Link>
        </div>
      </div>
    </div>
  );
}