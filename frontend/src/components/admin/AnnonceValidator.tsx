"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Send, Eye } from "lucide-react";
import Link from "next/link";
import { AnnonceRead } from "@/types/annonce";
import { annoncesService } from "@/services/annonces.service";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { Input } from "@/components/shared/Input";
import { useToast } from "@/contexts/ToastContext";
import { getErrorMessage } from "@/utils/errors";
import { formatDate } from "@/utils/format";

interface AnnonceValidatorProps {
  annonce: AnnonceRead;
  onRefresh: () => void;
}

const statutVariant = (statut: string): "success" | "warning" | "info" | "danger" | "default" => {
  const map: Record<string, any> = {
    BROUILLON: "default",
    EN_ATTENTE: "warning",
    APPROUVEE: "info",
    REJETEE: "danger",
    PUBLIEE: "success",
    EXPIREE: "default",
  };
  return map[statut] || "default";
};

export const AnnonceValidator = ({ annonce, onRefresh }: AnnonceValidatorProps) => {
  const { showToast } = useToast();
  const [action, setAction] = useState<"approuver" | "rejeter" | null>(null);
  const [motif, setMotif] = useState("");
  const [dateExpiration, setDateExpiration] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const peutApprouver = annonce.statut === "EN_ATTENTE";
  const peutRejeter = annonce.statut === "EN_ATTENTE";
  const peutPublier = annonce.statut === "APPROUVEE";

  const approuver = async () => {
    setIsLoading(true);
    try {
      await annoncesService.approuver(annonce.id, {
        date_expiration: dateExpiration || null,
      });
      showToast("Annonce approuvée", "success");
      setAction(null);
      setDateExpiration("");
      onRefresh();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const rejeter = async () => {
    if (motif.trim().length < 5) {
      showToast("Le motif doit contenir au moins 5 caractères", "error");
      return;
    }
    setIsLoading(true);
    try {
      await annoncesService.rejeter(annonce.id, { motif });
      showToast("Annonce rejetée", "success");
      setAction(null);
      setMotif("");
      onRefresh();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const publier = async () => {
    setIsLoading(true);
    try {
      await annoncesService.publier(annonce.id);
      showToast("Annonce publiée", "success");
      onRefresh();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-imo-gray p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge variant={statutVariant(annonce.statut)}>{annonce.statut}</Badge>
          </div>
          <p className="font-semibold text-imo-dark truncate">{annonce.titre}</p>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1">{annonce.description}</p>
          <p className="text-xs text-gray-400 mt-2">
            Soumise le {formatDate(annonce.date_soumission || annonce.cree_le)}
          </p>
          {annonce.motif_rejet && (
            <p className="text-xs text-red-600 mt-1">
              Motif de rejet : {annonce.motif_rejet}
            </p>
          )}
        </div>
        <Link
          href={`/admin/annonces/${annonce.id}`}
          className="p-2 rounded-lg text-gray-500 hover:text-imo-green hover:bg-imo-green-50 transition"
          title="Voir le détail"
        >
          <Eye size={16} />
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-imo-gray">
        {peutApprouver && (
          <Button variant="primary" size="sm" onClick={() => setAction("approuver")}>
            <CheckCircle2 size={14} /> Approuver
          </Button>
        )}
        {peutRejeter && (
          <Button variant="danger" size="sm" onClick={() => setAction("rejeter")}>
            <XCircle size={14} /> Rejeter
          </Button>
        )}
        {peutPublier && (
          <Button variant="accent" size="sm" onClick={publier} isLoading={isLoading}>
            <Send size={14} /> Publier
          </Button>
        )}
      </div>

      {/* Modal Approuver */}
      <Modal
        isOpen={action === "approuver"}
        onClose={() => setAction(null)}
        title="Approuver l'annonce"
      >
        <p className="text-sm text-gray-700 mb-4">
          Confirmez-vous l&apos;approbation de l&apos;annonce <strong>{annonce.titre}</strong> ?
        </p>
        <Input
          label="Date d'expiration (optionnel)"
          type="datetime-local"
          value={dateExpiration}
          onChange={(e) => setDateExpiration(e.target.value)}
        />
        <div className="flex gap-3 justify-end mt-4">
          <Button variant="ghost" onClick={() => setAction(null)}>Annuler</Button>
          <Button variant="primary" onClick={approuver} isLoading={isLoading}>
            Approuver
          </Button>
        </div>
      </Modal>

      {/* Modal Rejeter */}
      <Modal
        isOpen={action === "rejeter"}
        onClose={() => setAction(null)}
        title="Rejeter l'annonce"
      >
        <p className="text-sm text-gray-700 mb-4">
          Indiquez un motif de rejet pour <strong>{annonce.titre}</strong>.
        </p>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-imo-dark">Motif *</label>
          <textarea
            rows={4}
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder="Expliquez pourquoi cette annonce est rejetée..."
            className="w-full px-3 py-2 border border-imo-gray rounded-lg outline-none focus:border-imo-green focus:ring-2 focus:ring-imo-green/20 resize-none"
          />
          <span className="text-xs text-gray-500">{motif.length}/500 caractères (min. 5)</span>
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <Button variant="ghost" onClick={() => setAction(null)}>Annuler</Button>
          <Button variant="danger" onClick={rejeter} isLoading={isLoading}>
            Rejeter
          </Button>
        </div>
      </Modal>
    </div>
  );
};