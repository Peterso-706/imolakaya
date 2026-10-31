"use client";

import Link from "next/link";
import { Building2, MessageSquare, Megaphone, CreditCard, Plus } from "lucide-react";
import { useMesBiens } from "@/hooks/useMesBiens";
import { useContacts } from "@/hooks/useContacts";
import { useAnnonces } from "@/hooks/useAnnonces";
import { usePaiements } from "@/hooks/usePaiements";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/shared/Button";
import { formatDate } from "@/utils/format";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: biens, isLoading: loadingBiens } = useMesBiens();
  const { data: contacts } = useContacts();
  const { data: annonces } = useAnnonces();
  const { data: paiements } = usePaiements();

  const kpis = [
    {
      label: "Mes biens",
      value: biens?.total ?? "—",
      icon: Building2,
      href: "/proprietaire/biens",
      color: "text-imo-green",
      bg: "bg-imo-green-50",
    },
    {
      label: "Mes annonces",
      value: annonces?.total ?? "—",
      icon: Megaphone,
      href: "/proprietaire/annonces",
      color: "text-imo-yellow-dark",
      bg: "bg-yellow-50",
    },
    {
      label: "Contacts reçus",
      value: contacts?.total ?? "—",
      icon: MessageSquare,
      href: "/proprietaire/contacts",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Paiements",
      value: paiements?.total ?? "—",
      icon: CreditCard,
      href: "/proprietaire/paiements",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-imo-dark">
            Bonjour{user ? `, ${user.sub.slice(0, 8)}` : ""} 👋
          </h1>
          <p className="text-sm text-gray-600">
            Voici un aperçu de votre activité sur ImoLakaya.
          </p>
        </div>
        <Link href="/proprietaire/biens/nouveau">
          <Button variant="primary">
            <Plus size={16} /> Nouveau bien
          </Button>
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={kpi.label}
              href={kpi.href}
              className="bg-white rounded-lg border border-imo-gray p-4 hover:shadow-pop transition-shadow"
            >
              <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={kpi.color} />
              </div>
              <div className="text-2xl font-bold text-imo-dark">{kpi.value}</div>
              <div className="text-xs text-gray-600 mt-1">{kpi.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Derniers biens */}
      <div className="bg-white rounded-lg border border-imo-gray">
        <div className="flex items-center justify-between px-5 py-4 border-b border-imo-gray">
          <h2 className="font-bold text-imo-dark">Mes derniers biens</h2>
          <Link href="/proprietaire/biens" className="text-sm text-imo-green font-semibold hover:underline">
            Voir tout →
          </Link>
        </div>
        <div className="p-5">
          {loadingBiens && <LoadingSpinner />}
          {!loadingBiens && (!biens || biens.items.length === 0) && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-600 mb-3">Vous n&apos;avez pas encore de bien.</p>
              <Link href="/proprietaire/biens/nouveau">
                <Button variant="primary" size="sm">
                  <Plus size={14} /> Ajouter mon premier bien
                </Button>
              </Link>
            </div>
          )}
          {!loadingBiens && biens && biens.items.length > 0 && (
            <ul className="divide-y divide-imo-gray">
              {biens.items.slice(0, 5).map((bien) => (
                <li key={bien.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/proprietaire/biens/${bien.id}`}
                      className="font-medium text-imo-dark hover:text-imo-green truncate block"
                    >
                      {bien.titre}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {bien.statut} · créé le {formatDate(bien.cree_le)}
                    </p>
                  </div>
                  <Link
                    href={`/proprietaire/biens/${bien.id}`}
                    className="text-xs text-imo-green font-semibold hover:underline whitespace-nowrap"
                  >
                    Gérer
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}