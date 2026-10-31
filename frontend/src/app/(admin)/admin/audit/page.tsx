"use client";

import { useAudit } from "@/hooks/useAudit";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Pagination } from "@/components/shared/Pagination";
import { Badge } from "@/components/shared/Badge";
import { AuditLogRead } from "@/types/audit";
import { formatDateHeure } from "@/utils/format";

export default function AdminAuditPage() {
  const { data, isLoading, error, page, setPage } = useAudit();

  const columns: Column<AuditLogRead>[] = [
    {
      header: "Action",
      accessor: (l) => (
        <div>
          <Badge variant="info">{l.action}</Badge>
          <p className="text-xs text-gray-500 mt-1">
            {l.entite}
            {l.entite_id && ` · ${l.entite_id.slice(0, 8)}`}
          </p>
        </div>
      ),
    },
    {
      header: "Utilisateur",
      accessor: (l) => (
        <span className="font-mono text-xs text-gray-700">
          {l.utilisateur_id ? l.utilisateur_id.slice(0, 8) : "Anonyme"}
        </span>
      ),
    },
    {
      header: "Détails",
      accessor: (l) => (
        <span className="text-xs text-gray-600 line-clamp-2">
          {l.details ? JSON.stringify(l.details).slice(0, 80) : "—"}
        </span>
      ),
    },
    {
      header: "Adresse IP",
      accessor: (l) => (
        <span className="font-mono text-xs text-gray-500">{l.adresse_ip || "—"}</span>
      ),
    },
    {
      header: "Date",
      accessor: (l) => (
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {formatDateHeure(l.cree_le)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-imo-dark">Journal d&apos;audit</h1>
        <p className="text-sm text-gray-600">
          {data ? `${data.total} action(s) enregistrée(s)` : "Traçabilité des opérations sensibles"}
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.items || []}
        isLoading={isLoading}
        error={error}
        keyExtractor={(l) => l.id}
        emptyTitle="Aucune action enregistrée"
        emptyDescription="Les actions sensibles apparaîtront ici."
      />

      {data && data.pages > 1 && (
        <Pagination currentPage={page} totalPages={data.pages} onPageChange={setPage} />
      )}
    </div>
  );
}