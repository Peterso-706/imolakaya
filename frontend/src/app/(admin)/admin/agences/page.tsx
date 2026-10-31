"use client";

import { useState } from "react";
import { Plus, Pencil, Building2 } from "lucide-react";
import { useAgences } from "@/hooks/useAgences";
import { agencesService } from "@/services/agences.service";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { Input } from "@/components/shared/Input";
import { useToast } from "@/contexts/ToastContext";
import { getErrorMessage } from "@/utils/errors";
import { AgenceRead, AgenceCreate, AgenceUpdate } from "@/types/agence";

export default function AdminAgencesPage() {
  const { showToast } = useToast();
  const { agences, isLoading, error, refetch } = useAgences();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<AgenceRead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulaire
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [estActive, setEstActive] = useState(true);

  const ouvrirCreation = () => {
    setEditing(null);
    setNom(""); setAdresse(""); setTelephone(""); setEmail(""); setEstActive(true);
    setIsOpen(true);
  };

  const ouvrirEdition = (agence: AgenceRead) => {
    setEditing(agence);
    setNom(agence.nom);
    setAdresse(agence.adresse || "");
    setTelephone(agence.telephone || "");
    setEmail(agence.email || "");
    setEstActive(agence.est_active);
    setIsOpen(true);
  };

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) {
      showToast("Le nom est obligatoire", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editing) {
        const payload: AgenceUpdate = {
          nom: nom.trim(),
          adresse: adresse.trim() || null,
          telephone: telephone.trim() || null,
          email: email.trim() || null,
          est_active: estActive,
        };
        await agencesService.modifierAgence(editing.id, payload);
        showToast("Agence modifiée", "success");
      } else {
        const payload: AgenceCreate = {
          nom: nom.trim(),
          adresse: adresse.trim() || null,
          telephone: telephone.trim() || null,
          email: email.trim() || null,
        };
        await agencesService.creerAgence(payload);
        showToast("Agence créée", "success");
      }
      setIsOpen(false);
      refetch();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<AgenceRead>[] = [
    {
      header: "Agence",
      accessor: (a) => (
        <div>
          <p className="font-semibold text-imo-dark">{a.nom}</p>
          {a.adresse && <p className="text-xs text-gray-500">{a.adresse}</p>}
        </div>
      ),
    },
    {
      header: "Contact",
      accessor: (a) => (
        <div className="text-xs">
          {a.telephone && <p>{a.telephone}</p>}
          {a.email && <p className="text-gray-500">{a.email}</p>}
        </div>
      ),
    },
    {
      header: "Statut",
      accessor: (a) => (
        <Badge variant={a.est_active ? "success" : "danger"}>
          {a.est_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "",
      className: "text-right",
      accessor: (a) => (
        <button
          onClick={() => ouvrirEdition(a)}
          className="inline-flex p-2 rounded-lg text-gray-500 hover:text-imo-green hover:bg-imo-green-50 transition"
          title="Modifier"
        >
          <Pencil size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-imo-dark">Agences</h1>
          <p className="text-sm text-gray-600">
            {agences.length} agence(s) enregistrée(s)
          </p>
        </div>
        <Button variant="primary" onClick={ouvrirCreation}>
          <Plus size={16} /> Nouvelle agence
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={agences}
        isLoading={isLoading}
        error={error}
        keyExtractor={(a) => a.id}
        emptyTitle="Aucune agence"
        emptyDescription="Créez votre première agence pour organiser vos employés."
      />

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? "Modifier l'agence" : "Nouvelle agence"}
      >
        <form onSubmit={soumettre} className="space-y-4">
          <Input
            label="Nom *"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Agence ImoLakaya Pétion-Ville"
          />
          <Input
            label="Adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            placeholder="Rue, ville..."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Téléphone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="+509 XXXX-XXXX"
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agence@example.com"
            />
          </div>
          {editing && (
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-imo-light rounded-lg">
              <input
                type="checkbox"
                checked={estActive}
                onChange={(e) => setEstActive(e.target.checked)}
                className="w-4 h-4 accent-imo-green"
              />
              <span className="text-sm text-imo-dark">Agence active</span>
            </label>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editing ? "Enregistrer" : "Créer"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}