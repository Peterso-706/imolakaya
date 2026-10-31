// frontend/src/types/bien.ts
import { 
  Devise, 
  FrequencePaiement, 
  StatutBien, 
  TypeLocation, 
  TypeOperation 
} from "./enums";
import { MediaRead } from "./media";


// --- Kategori ---
export interface CategorieBase {
  nom: string;
  slug: string;
  description?: string | null;
  icone?: string | null;
  ordre: number;
}

export interface CategorieRead extends CategorieBase {
  id: string;
  est_active: boolean;
}

// --- Lokalizasyon ---
export interface LocalisationBase {
  departement: string;
  commune: string;
  zone: string;
  adresse_descriptive?: string | null;
}

export interface LocalisationRead extends LocalisationBase {
  id: string;
}

export interface BienBase {
  titre: string;
  description: string;
  type_operation: TypeOperation;
  type_location?: TypeLocation | null;
  prix: number; // Decimal nan Python = number nan TS
  devise: Devise;
  frequence_paiement?: FrequencePaiement | null;
  nombre_chambres?: number | null;
  nombre_salles_bain?: number | null;
  superficie_m2?: number | null;
  annee_construction?: number | null;
  caracteristiques?: Record<string, unknown> | null;
}

export interface BienCreate extends BienBase {
  categorie_id: string;
  localisation_id: string;
  statut?: StatutBien;
  reference_interne?: string | null;
}

export interface BienUpdate {
  titre?: string;
  description?: string;
  type_operation?: TypeOperation;
  type_location?: TypeLocation | null;
  prix?: number;
  devise?: Devise;
  frequence_paiement?: FrequencePaiement | null;
  nombre_chambres?: number | null;
  nombre_salles_bain?: number | null;
  superficie_m2?: number | null;
  annee_construction?: number | null;
  caracteristiques?: Record<string, unknown> | null;
  categorie_id?: string;
  localisation_id?: string;
  statut?: StatutBien;
  est_actif?: boolean;
}

export interface BienRead extends BienBase {
  id: string;
  statut: StatutBien;
  est_actif: boolean;
  categorie_id: string;
  localisation_id: string;
  proprietaire_id: string;
  cree_le: string; // Datetime
}

export interface BienReadDetail extends BienRead {
  categorie: CategorieRead;
  localisation: LocalisationRead;
  medias: MediaRead[];
}

export interface BienSearchParams {
  q?: string | null;
  type_operation?: TypeOperation | null;
  type_location?: TypeLocation | null;
  categorie_id?: string | null;
  departement?: string | null;
  commune?: string | null;
  zone?: string | null;
  prix_min?: number | null;
  prix_max?: number | null;
  statut?: StatutBien | null;
  page?: number;
  taille?: number;
}