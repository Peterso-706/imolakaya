"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { utilisateursService } from "@/services/utilisateurs.service";
import { UserForm } from "@/components/admin/UserForm";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { Badge } from "@/components/shared/Badge";
import { Pagination } from "@/components/shared/Pagination";
import { useToast } from "@/contexts/ToastContext";
import { getErrorMessage } from "@/utils/errors";
import { formatDate } from "@/utils/format";
import { UtilisateurRead, UtilisateurCreate } from "@/types/utilisateur";

export default function AdminUtilisateursPage() {
  const { showToast } = useToast();
  const { data, isLoading, error, page, setPage, refetch } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const creerUtilisateur = async (payload: UtilisateurCreate, roles: string[]) => {
    setIsSubmitting(true);
    try {
      await utilisateursService.creer(payload, roles);
      showToast("Utilisateur créé avec succès", "success");
      setIsCreating(false);
      refetch();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<UtilisateurRead>[] = [
    {
      header: "Utilisateur",
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
        <div className="flex gap-1 flex-wrap">
          <Badge variant={u.est_actif ? "success" : "danger"}>
            {u.est_actif ? "Actif" : "Inactif"}
          </Badge>
          {u.est_verifie && <Badge variant="info">Vérifié</Badge>}
        </div>
      ),
    },
    {
      header: "Créé le",
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
          className="inline-flex p-2 rounded-lg text-gray-500 hover:text-imo-green hover:bg-imo-green-50 transition"
          title="Modifier"
        >
          <Pencil size={16} />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-imo-dark">Utilisateurs</h1>
          <p className="text-sm text-gray-600">
            {data ? `${data.total} utilisateur(s)` : "Gérez les comptes de la plateforme"}
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreating(true)}>
          <Plus size={16} /> Nouvel utilisateur
        </Button>
      </div>

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

      <Modal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Créer un nouvel utilisateur"
      >
        <UserForm
          mode="creation"
          onSubmitCreation={creerUtilisateur}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}