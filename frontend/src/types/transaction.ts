// frontend/src/types/transaction.ts
import { TypeTransaction } from "./enums";

export interface TransactionRead {
  id: string;
  paiement_id: string;
  utilisateur_id?: string | null;
  type: TypeTransaction;
  message?: string | null;
  donnees?: Record<string, any> | null;
  adresse_ip?: string | null;
  cree_le: string; // Datetime
}