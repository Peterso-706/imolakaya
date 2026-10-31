// frontend/src/types/api.ts

export interface MessageResponse {
  message: string;
}

export interface IdResponse {
  id: string;
}

export interface PaginationParams {
  page?: number;
  taille?: number;
}

// Pou repons ki gen plizyè paj (Paginated)
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  taille: number;
  pages: number;
}