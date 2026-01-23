// Utils/User.ts
// User-related API helpers for auth and profile using the Elysia backend
import type {
  User,
  RegisterPayload,
  LoginPayload,
  RegisterResponse,
  LoginResponse,
} from "@/Types/User";

const API_PREFIX = "/api";
const TOKEN_KEY = "auth_token";

function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // same origin in browser
  return process.env.ORIGIN || "http://localhost:3000"; // SSR/default
}

async function fetchJSON<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(getBaseUrl() + API_PREFIX + path, {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return data;
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function registerUser(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  return fetchJSON<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetchJSON<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if ((res as any).ok && (res as any).token) setToken((res as any).token);
  return res;
}

export function logoutUser() {
  setToken(null);
}

export async function authFetch(input: string, init: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}

const UserAPI = {
  registerUser,
  loginUser,
  logoutUser,
  getToken,
  setToken,
  isAuthenticated,
  authFetch,
};

export default UserAPI;
export type {
  User,
  RegisterPayload,
  LoginPayload,
  RegisterResponse,
  LoginResponse,
};
