"use client";

import Link from "next/link";
import { UserCog, Plus, Info } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Pagination } from "@/components/shared/Pagination";
import { formatDate } from "@/utils/format";
import { UtilisateurRead } from "@/types/utilisateur";

export default function AdminProprietairesPage() {
  const { data, isLoading, error, page, setPage } = useUser();

  const columns: Column<UtilisateurRead>[] = [
    {
      header: "Propriétaire",
      accessor: (u) => (
        <div className="min-w-0">
          <p className="font-semibold truncate">
            {u.prenom ? `${u.prenom} ${u.nom}` : u.nom}
          </p>
          <p className="text-xs text-gray-500 truncate">{u.email}</p>
        </div>
      ),
    },
    {
      header: "Téléphone",
      accessor: (u) => <span className="text-sm">{u.telephone || "—"}</span>,
    },
    {
      header: "Statut",
      accessor: (u) => (
        <Badge variant={u.est_actif ? "success" : "danger"}>
          {u.est_actif ? "Actif" : "Inactif"}
        </Badge>
      ),
    },
    {
      header: "Inscrit le",
      accessor: (u) => (
        <span className="text-xs text-gray-500">{formatDate(u.cree_le)}</span>
      ),
    },
    {
      header: "",
      className: "text-right",
      accessor: (u) => (
        <Link
          href={`/admin/utilisateurs/${u.id}`}
          className="text-xs text-imo-green font-semibold hover:underline whitespace-nowrap"
        >
          Gérer
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-imo-dark">Propriétaires</h1>
          <p className="text-sm text-gray-600">
            Gérez les comptes propriétaires de la plateforme.
          </p>
        </div>
        <Link href="/admin/utilisateurs">
          <Button variant="primary">
            <Plus size={16} /> Créer un compte
          </Button>
        </Link>
      </div>

      {/* Bandeau informatif */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 flex gap-3">
        <Info size={20} className="flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold mb-1">Information technique</p>
          <p>
            Cette page affiche actuellement <strong>tous les utilisateurs</strong> car le backend
            n&apos;expose pas encore d&apos;endpoint dédié <code className="bg-white px-1 rounded">GET /admin/proprietaires</code>{" "}
            ni ne retourne les rôles dans <code className="bg-white px-1 rounded">GET /admin/utilisateurs</code>.
            Pour filtrer uniquement les propriétaires, ajoutez l&apos;un de ces deux éléments côté backend.
          </p>
        </div>
      </div>

      {data && (
        <div className="bg-white rounded-lg border border-imo-gray p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-imo-green-50 flex items-center justify-center">
            <UserCog className="text-imo-green" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-imo-dark">{data.total}</p>
            <p className="text-xs text-gray-600">utilisateur(s) enregistré(s) sur la plateforme</p>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={data?.items || []}
        isLoading={isLoading}
        error={error}
        keyExtractor={(u) => u.id}
        emptyTitle="Aucun utilisateur"
        emptyDescription="Aucun utilisateur n'a encore été créé."
      />

      {data && data.pages > 1 && (
        <Pagination currentPage={page} totalPages={data.pages} onPageChange={setPage} />
      )}
    </div>
  );
}