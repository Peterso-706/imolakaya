// frontend/src/types/paiement.ts
import { Devise, MethodePaiement, SourcePaiement, StatutPaiement } from "./enums";

export interface PaiementCreateEnLigne {
  annonce_id: string;
  montant: number;
  devise?: Devise;
  methode: MethodePaiement;
}

export interface PaiementCreateAgence {
  annonce_id: string;
  proprietaire_id: string;
  montant: number;
  devise?: Devise;
  methode: MethodePaiement;
  reference: string;
  agent_responsable: string;
  note_interne?: string | null;
}

export interface PaiementRead {
  id: string;
  annonce_id: string;
  proprietaire_id: string;
  employe_id?: string | null;
  montant: number;
  devise: Devise;
  source: SourcePaiement;
  methode: MethodePaiement;
  reference: string;
  reference_fournisseur?: string | null;
  statut: StatutPaiement;
  verifie_par_webhook: boolean;
  date_paiement?: string | null;
  date_confirmation?: string | null;
  agent_responsable?: string | null;
  cree_le: string;
}

export interface PaiementReadDetail extends PaiementRead {
  preuve_serveur?: Record<string, any> | null;
}

export interface PaiementConfirmerManuelRequest {
  preuve: string;
}