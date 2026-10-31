// frontend/src/types/audit.ts

export interface AuditLogRead {
  id: string;
  utilisateur_id?: string | null;
  action: string;
  entite: string;
  entite_id?: string | null;
  details?: Record<string, any> | null;
  adresse_ip?: string | null;
  user_agent?: string | null;
  cree_le: string; // Datetime
}