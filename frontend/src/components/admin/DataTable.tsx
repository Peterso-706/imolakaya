"use client";

import { ReactNode } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

export interface Column<T> {
  header: string;
  accessor: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  error?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  keyExtractor: (item: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  error,
  emptyTitle = "Aucun résultat",
  emptyDescription = "Aucune donnée à afficher pour le moment.",
  keyExtractor,
}: DataTableProps<T>) {
  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }
  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="bg-white rounded-lg border border-imo-gray overflow-hidden">
      {/* Vue desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-imo-light text-xs text-gray-600 uppercase">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`text-left px-4 py-3 font-semibold ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-imo-gray">
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-imo-light/50 transition">
                {columns.map((col, i) => (
                  <td key={i} className={`px-4 py-3 text-imo-dark ${col.className || ""}`}>
                    {col.accessor(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vue mobile */}
      <ul className="md:hidden divide-y divide-imo-gray">
        {data.map((item) => (
          <li key={keyExtractor(item)} className="p-4 space-y-2">
            {columns.map((col, i) => (
              <div key={i} className="flex justify-between gap-3 text-sm">
                <span className="text-gray-600 font-medium">{col.header} :</span>
                <span className="text-imo-dark text-right">{col.accessor(item)}</span>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}