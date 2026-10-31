// frontend/src/types/media.ts
import { TypeMedia } from "./enums";

export interface MediaCreate {
  url: string;
  public_id?: string | null;
  type: TypeMedia;
  ordre: number;
  est_couverture: boolean;
  titre?: string | null;
}

export interface MediaUpdate {
  ordre?: number;
  est_couverture?: boolean;
  titre?: string | null;
}

export interface MediaRead {
  id: string;
  bien_id: string;
  url: string;
  type: TypeMedia;
  ordre: number;
  est_couverture: boolean;
  titre?: string | null;
  format?: string | null;
  taille_octets?: number | null;
  largeur?: number | null;
  hauteur?: number | null;
  cree_le: string; // Datetime
}

export interface MediaReorderItem {
  id: string;
  ordre: number;
}

export interface MediaReorderRequest {
  items: MediaReorderItem[];
}