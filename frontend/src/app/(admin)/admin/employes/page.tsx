"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil } from "lucide-react";
import { useAgences } from "@/hooks/useAgences";
import { agencesService } from "@/services/agences.service";
import { utilisateursService } from "@/services/utilisateurs.service";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import { useToast } from "@/contexts/ToastContext";
import { getErrorMessage } from "@/utils/errors";
import { EmployeRead, EmployeCreate, EmployeUpdate } from "@/types/agence";
import { UtilisateurRead } from "@/types/utilisateur";

export default function AdminEmployesPage() {
  const { showToast } = useToast();
  const { agences, employes, isLoading, error, refetch } = useAgences();

  const [utilisateurs, setUtilisateurs] = useState<UtilisateurRead[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<EmployeRead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger tous les utilisateurs pour la sélection
  useEffect(() => {
    (async () => {
      try {
        const res = await utilisateursService.lister(1, 100);
        setUtilisateurs(res.items);
      } catch {
        // silencieux
      }
    })();
  }, []);

  // Formulaire
  const [utilisateurId, setUtilisateurId] = useState("");
  const [agenceId, setAgenceId] = useState("");
  const [matricule, setMatricule] = useState("");
  const [poste, setPoste] = useState("");
  const [estActif, setEstActif] = useState(true);

  const ouvrirCreation = () => {
    setEditing(null);
    setUtilisateurId(""); setAgenceId(""); setMatricule(""); setPoste(""); setEstActif(true);
    setIsOpen(true);
  };

  const ouvrirEdition = (employe: EmployeRead) => {
    setEditing(employe);
    setUtilisateurId(employe.utilisateur_id);
    setAgenceId(employe.agence_id);
    setMatricule(employe.matricule || "");
    setPoste(employe.poste || "");
    setEstActif(employe.est_actif);
    setIsOpen(true);
  };

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) {
      if (!utilisateurId || !agenceId) {
        showToast("Utilisateur et agence obligatoires", "error");
        return;
      }
    }
    setIsSubmitting(true);
    try {
      if (editing) {
        const payload: EmployeUpdate = {
          matricule: matricule.trim() || null,
          poste: poste.trim() || null,
          est_actif: estActif,
        };
        await agencesService.modifierEmploye(editing.id, payload);
        showToast("Employé modifié", "success");
      } else {
        const payload: EmployeCreate = {
          utilisateur_id: utilisateurId,
          agence_id: agenceId,
          matricule: matricule.trim() || null,
          poste: poste.trim() || null,
        };
        await agencesService.creerEmploye(payload);
        showToast("Employé créé", "success");
      }
      setIsOpen(false);
      refetch();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNomUtilisateur = (id: string) => {
    const u = utilisateurs.find((x) => x.id === id);
    return u ? `${u.prenom || ""} ${u.nom}`.trim() : id.slice(0, 8);
  };

  const getNomAgence = (id: string) => {
    return agences.find((a) => a.id === id)?.nom || id.slice(0, 8);
  };

  const columns: Column<EmployeRead>[] = [
    {
      header: "Employé",
      accessor: (e) => (
        <div>
          <p className="font-semibold text-imo-dark">{getNomUtilisateur(e.utilisateur_id)}</p>
          {e.poste && <p className="text-xs text-gray-500">{e.poste}</p>}
        </div>
      ),
    },
    {
      header: "Agence",
      accessor: (e) => <span className="text-sm">{getNomAgence(e.agence_id)}</span>,
    },
    {
      header: "Matricule",
      accessor: (e) => (
        <span className="font-mono text-xs">{e.matricule || "—"}</span>
      ),
    },
    {
      header: "Statut",
      accessor: (e) => (
        <Badge variant={e.est_actif ? "success" : "danger"}>
          {e.est_actif ? "Actif" : "Inactif"}
        </Badge>
      ),
    },
    {
      header: "",
      className: "text-right",
      accessor: (e) => (
        <button
          onClick={() => ouvrirEdition(e)}
          className="inline-flex p-2 rounded-lg text-gray-500 hover:text-imo-green hover:bg-imo-green-50 transition"
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
          <h1 className="text-2xl font-bold text-imo-dark">Employés d&apos;agence</h1>
          <p className="text-sm text-gray-600">{employes.length} employé(s) enregistré(s)</p>
        </div>
        <Button variant="primary" onClick={ouvrirCreation}>
          <Plus size={16} /> Nouvel employé
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={employes}
        isLoading={isLoading}
        error={error}
        keyExtractor={(e) => e.id}
        emptyTitle="Aucun employé"
        emptyDescription="Créez un employé en le liant à une agence."
      />

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? "Modifier l'employé" : "Nouvel employé"}
      >
        <form onSubmit={soumettre} className="space-y-4">
          {!editing && (
            <>
              <Select
                label="Utilisateur *"
                placeholder="Sélectionner un utilisateur"
                value={utilisateurId}
                onChange={(e) => setUtilisateurId(e.target.value)}
                options={utilisateurs.map((u) => ({
                  value: u.id,
                  label: `${u.prenom || ""} ${u.nom} — ${u.email}`.trim(),
                }))}
              />
              <Select
                label="Agence *"
                placeholder="Sélectionner une agence"
                value={agenceId}
                onChange={(e) => setAgenceId(e.target.value)}
                options={agences.map((a) => ({ value: a.id, label: a.nom }))}
              />
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Matricule"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              placeholder="EMP-001"
            />
            <Input
              label="Poste"
              value={poste}
              onChange={(e) => setPoste(e.target.value)}
              placeholder="Agent immobilier"
            />
          </div>

          {editing && (
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-imo-light rounded-lg">
              <input
                type="checkbox"
                checked={estActif}
                onChange={(e) => setEstActif(e.target.checked)}
                className="w-4 h-4 accent-imo-green"
              />
              <span className="text-sm text-imo-dark">Employé actif</span>
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