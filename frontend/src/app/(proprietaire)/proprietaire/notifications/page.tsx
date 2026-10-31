"use client";

import Link from "next/link";
import { Bell, Check, CheckCheck } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { Badge } from "@/components/shared/Badge";
import { formatDateHeure } from "@/utils/format";

export default function NotificationsPage() {
  const { data, isLoading, error, page, setPage, marquerLue } = useNotifications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-imo-dark">Mes notifications</h1>
        <p className="text-sm text-gray-600">
          {data ? `${data.total} notification(s)` : "Toutes vos notifications"}
        </p>
      </div>

      {isLoading && <LoadingSpinner size="lg" />}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!isLoading && !error && data && data.items.length === 0 && (
        <EmptyState
          title="Aucune notification"
          description="Vous serez notifié des actions importantes ici."
        />
      )}

      {!isLoading && !error && data && data.items.length > 0 && (
        <>
          <div className="bg-white rounded-lg border border-imo-gray overflow-hidden">
            <ul className="divide-y divide-imo-gray">
              {data.items.map((notif) => (
                <li
                  key={notif.id}
                  className={`p-4 flex flex-col md:flex-row md:items-start gap-3 ${
                    !notif.est_lue ? "bg-imo-green-50/50" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-imo-green-50 flex items-center justify-center flex-shrink-0">
                    <Bell size={18} className="text-imo-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-imo-dark">{notif.titre}</p>
                      {!notif.est_lue && <Badge variant="info">Nouveau</Badge>}
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDateHeure(notif.cree_le)}
                    </p>
                    {notif.lien && (
                      <Link
                        href={notif.lien}
                        className="text-xs text-imo-green font-semibold hover:underline mt-1 inline-block"
                      >
                        Voir le détail →
                      </Link>
                    )}
                  </div>
                  {!notif.est_lue && (
                    <button
                      onClick={() => marquerLue(notif.id)}
                      className="flex items-center gap-1 text-sm text-imo-green font-semibold hover:underline whitespace-nowrap"
                    >
                      <Check size={14} /> Marquer comme lu
                    </button>
                  )}
                  {notif.est_lue && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <CheckCheck size={14} /> Lu
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <Pagination currentPage={page} totalPages={data.pages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}