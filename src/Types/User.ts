// src/types/User.ts
export type User = {
  id: string;
  email: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  phone: string | null;
  position: string | null;
  createdAt: string; // ISO
};

export type RegisterPayload = {
  email: string;
  password: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  phone?: string | null;
  position?: string | null;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type AuthSuccess = {
  ok: true;
  token: string;
  user: User;
  expiresAt: string; // ISO
};

export type AuthError =
  | { ok: false; error: "invalid_credentials" | "validation_error" | "user_exists" | "identifier_required" }
  | { ok: false; error: string };

export type RegisterResponse = AuthSuccess | AuthError;
export type LoginResponse = AuthSuccess | AuthError;

export type UserRow = {
  id: string;
  email: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  phone: string | null;
  position: string | null;
  passwordHash?: string | null;
  createdAt: string;
};

export type TokenRow = {
  userId: string;
  expiresAt?: string | null;
};

export type PurchaseRow = {
  id: string;
  userId: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
};

export type PurchaseItemRow = {
  id: string;
  purchaseId: string;
  productId: string | null;
  title: string;
  quantity: number;
  unitPrice: number;
  currency: string;
};
