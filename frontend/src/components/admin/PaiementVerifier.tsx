"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { PaiementRead } from "@/types/paiement";
import { paiementsService } from "@/services/paiements.service";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { useToast } from "@/contexts/ToastContext";
import { getErrorMessage } from "@/utils/errors";
import { formatPrix, formatDateHeure } from "@/utils/format";

interface PaiementVerifierProps {
  paiement: PaiementRead;
  onRefresh: () => void;
}

const statutVariant = (statut: string): "success" | "warning" | "danger" | "default" => {
  const map: Record<string, any> = {
    EN_ATTENTE: "warning",
    CONFIRME: "success",
    ECHOUE: "danger",
    ANNULE: "default",
  };
  return map[statut] || "default";
};

export const PaiementVerifier = ({ paiement, onRefresh }: PaiementVerifierProps) => {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [preuve, setPreuve] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const peutConfirmer = paiement.statut === "EN_ATTENTE";

  const confirmer = async () => {
    if (preuve.trim().length < 5) {
      showToast("La preuve doit contenir au moins 5 caractères", "error");
      return;
    }
    setIsLoading(true);
    try {
      await paiementsService.confirmer(paiement.id, { preuve });
      showToast("Paiement confirmé manuellement", "success");
      setIsOpen(false);
      setPreuve("");
      onRefresh();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-imo-gray p-4 flex flex-col md:flex-row md:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge variant={statutVariant(paiement.statut)}>{paiement.statut}</Badge>
          <Badge variant="default">{paiement.source}</Badge>
        </div>
        <p className="font-semibold text-imo-green">
          {formatPrix(Number(paiement.montant), paiement.devise as any)}
        </p>
        <p className="text-xs text-gray-500">
          {paiement.methode} · Réf. {paiement.reference}
        </p>
        <p className="text-xs text-gray-400">
          {paiement.date_paiement
            ? `Payé le ${formatDateHeure(paiement.date_paiement)}`
            : `Créé le ${formatDateHeure(paiement.cree_le)}`}
        </p>
        {paiement.verifie_par_webhook && (
          <p className="text-xs text-green-600 mt-1">✓ Confirmé par webhook fournisseur</p>
        )}
      </div>

      {peutConfirmer && (
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
          <CheckCircle2 size={14} /> Confirmer manuellement
        </Button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirmer le paiement manuellement"
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Montant : <strong>{formatPrix(Number(paiement.montant), paiement.devise as any)}</strong>
          </p>
          <p className="text-sm text-gray-700">
            Référence : <span className="font-mono text-xs">{paiement.reference}</span>
          </p>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-imo-dark">
              Preuve de vérification *
            </label>
            <textarea
              rows={3}
              value={preuve}
              onChange={(e) => setPreuve(e.target.value)}
              placeholder="Référence de la transaction, motif de la vérification manuelle..."
              className="w-full px-3 py-2 border border-imo-gray rounded-lg outline-none focus:border-imo-green focus:ring-2 focus:ring-imo-green/20 resize-none"
            />
            <span className="text-xs text-gray-500">Minimum 5 caractères</span>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button variant="primary" onClick={confirmer} isLoading={isLoading}>
              Confirmer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};