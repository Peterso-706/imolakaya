"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, MapPin } from "lucide-react";
import { biensService } from "@/services/biens.service";
import { BienRead } from "@/types/bien";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { Badge } from "@/components/shared/Badge";
import { DataTable, Column } from "@/components/admin/DataTable";
import { formatPrix, formatDate } from "@/utils/format";

const statutVariant = (statut: string): "success" | "warning" | "info" | "default" => {
  const map: Record<string, any> = {
    DISPONIBLE: "success",
    RESERVE: "warning",
    LOUE: "info",
    VENDU: "default",
    RETIRE: "default",
  };
  return map[statut] || "default";
};

export default function AdminBiensPage() {
  const [data, setData] = useState<{ items: BienRead[]; total: number; page: number; pages: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchBiens = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await biensService.listerAdmin(page, 20);
      setData(response);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des biens");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBiens();
  }, [page]);

  const columns: Column<BienRead>[] = [
    {
      header: "Titre",
      accessor: (b) => (
        <div className="min-w-0">
          <p className="font-semibold truncate">{b.titre}</p>
          <p className="text-xs text-gray-500">{b.type_operation}</p>
        </div>
      ),
    },
    {
      header: "Prix",
      accessor: (b) => (
        <span className="font-semibold text-imo-green whitespace-nowrap">
          {formatPrix(Number(b.prix), b.devise as any)}
        </span>
      ),
    },
    {
      header: "Statut",
      accessor: (b) => <Badge variant={statutVariant(b.statut)}>{b.statut}</Badge>,
    },
    {
      header: "Créé le",
      accessor: (b) => <span className="text-xs text-gray-500">{formatDate(b.cree_le)}</span>,
    },
    {
      header: "",
      className: "text-right",
      accessor: (b) => (
        <Link
          href={`/biens/${b.id}`}
          target="_blank"
          className="inline-flex p-2 rounded-lg text-gray-500 hover:text-imo-green hover:bg-imo-green-50 transition"
          title="Voir la fiche publique"
        >
          <Eye size={16} />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-imo-dark">Tous les biens</h1>
        <p className="text-sm text-gray-600">
          {data ? `${data.total} bien(s) sur la plateforme` : "Vue d'ensemble des biens"}
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.items || []}
        isLoading={isLoading}
        error={error}
        keyExtractor={(b) => b.id}
        emptyTitle="Aucun bien"
        emptyDescription="Aucun bien n'a encore été créé sur la plateforme."
      />

      {data && data.pages > 1 && (
        <Pagination currentPage={page} totalPages={data.pages} onPageChange={setPage} />
      )}
    </div>
  );
}