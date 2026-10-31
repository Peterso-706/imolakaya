"use client";

import { useEffect, useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { referentielsService } from "@/services/referentiels.service";
import { LocalisationRead } from "@/types/bien";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { Input } from "@/components/shared/Input";
import { useToast } from "@/contexts/ToastContext";
import { getErrorMessage } from "@/utils/errors";

export default function AdminLocalisationsPage() {
  const { showToast } = useToast();
  const [localisations, setLocalisations] = useState<LocalisationRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [departement, setDepartement] = useState("");
  const [commune, setCommune] = useState("");
  const [zone, setZone] = useState("");
  const [adresse, setAdresse] = useState("");

  const charger = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await referentielsService.listerLocalisationsAdmin();
      setLocalisations(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const ouvrirCreation = () => {
    setDepartement(""); setCommune(""); setZone(""); setAdresse("");
    setIsOpen(true);
  };

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departement.trim() || !commune.trim() || !zone.trim()) {
      showToast("Département, commune et zone obligatoires", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await referentielsService.creerLocalisation({
        departement: departement.trim(),
        commune: commune.trim(),
        zone: zone.trim(),
        adresse_descriptive: adresse.trim() || null,
      });
      showToast("Localisation créée", "success");
      setIsOpen(false);
      charger();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<LocalisationRead>[] = [
    {
      header: "Zone",
      accessor: (l) => (
        <div className="flex items-start gap-2">
          <MapPin size={16} className="text-imo-green mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-imo-dark">{l.zone}</p>
            {l.adresse_descriptive && (
              <p className="text-xs text-gray-500">{l.adresse_descriptive}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Commune",
      accessor: (l) => <span className="text-sm">{l.commune}</span>,
    },
    {
      header: "Département",
      accessor: (l) => <span className="text-sm text-gray-600">{l.departement}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-imo-dark">Localisations</h1>
          <p className="text-sm text-gray-600">
            {localisations.length} localisation(s) enregistrée(s)
          </p>
        </div>
        <Button variant="primary" onClick={ouvrirCreation}>
          <Plus size={16} /> Nouvelle localisation
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={localisations}
        isLoading={isLoading}
        error={error}
        keyExtractor={(l) => l.id}
        emptyTitle="Aucune localisation"
        emptyDescription="Ajoutez les zones géographiques couvertes par la plateforme."
      />

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Nouvelle localisation"
      >
        <form onSubmit={soumettre} className="space-y-4">
          <Input
            label="Département *"
            value={departement}
            onChange={(e) => setDepartement(e.target.value)}
            placeholder="Ouest"
          />
          <Input
            label="Commune *"
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
            placeholder="Pétion-Ville"
          />
          <Input
            label="Zone *"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            placeholder="Juvenat"
          />
          <Input
            label="Adresse descriptive (optionnel)"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            placeholder="Rue, numéro, repères..."
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Créer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}