// frontend/src/types/role.ts

export interface PermissionRef {
  id: string;
  code: string;
  description?: string | null;
}

export interface RoleBase {
  nom: string;
  description?: string | null;
}

export interface RoleCreate extends RoleBase {
  permissions_ids: string[];
}

export interface RoleUpdate {
  nom?: string;
  description?: string | null;
  permissions_ids?: string[] | null;
}

export interface RoleRead extends RoleBase {
  id: string;
  permissions: PermissionRef[];
}