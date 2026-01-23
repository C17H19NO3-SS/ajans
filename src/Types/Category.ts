// src/types/Category.ts
export type Category = {
  id: string; // slug
  title: string;
  description?: string | null;
  icon?: string | null;
  created_at?: string;
  updated_at?: string;
};
