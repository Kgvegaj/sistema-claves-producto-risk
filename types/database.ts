// types/database.ts
export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface ProductKey {
  id: string;
  key_value: string;
  is_active: boolean;
  created_at: string;
  activated_at: string | null;
  device_id: string | null;
  valid_until: string | null;
}