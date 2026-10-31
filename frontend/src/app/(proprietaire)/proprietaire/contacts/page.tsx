"use client";

import { useContacts } from "@/hooks/useContacts";
import { ContactList } from "@/components/proprietaire/ContactList";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";

export default function ContactsPage() {
  const { data, isLoading, error, page, setPage } = useContacts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-imo-dark">Mes contacts</h1>
        <p className="text-sm text-gray-600">
          {data ? `${data.total} demande(s) de contact reçue(s)` : "Demandes des visiteurs"}
        </p>
      </div>

      {isLoading && <LoadingSpinner size="lg" />}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!isLoading && !error && data && data.items.length === 0 && (
        <EmptyState
          title="Aucun contact pour le moment"
          description="Les visiteurs intéressés par vos biens apparaîtront ici."
        />
      )}

      {!isLoading && !error && data && data.items.length > 0 && (
        <>
          <ContactList contacts={data.items} />
          <Pagination currentPage={page} totalPages={data.pages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}