import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AdminUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  company: string | null;
};

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error";

type LoginResult =
  | { ok: true }
  | { ok: false; error: string; status?: number };

type AdminAuthContextValue = {
  status: AuthStatus;
  user: AdminUser | null;
  token: string | null;
  error: string | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "admin-panel-session";

type StoredSession = {
  token: string;
  expiresAt?: string;
};

const readSession = (): StoredSession | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
};

const writeSession = (session: StoredSession | null) => {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

const serializeUser = (data: any): AdminUser => ({
  id: String(data?.id ?? ""),
  email: String(data?.email ?? ""),
  firstName: data?.firstName ?? null,
  lastName: data?.lastName ?? null,
  position: data?.position ?? null,
  company: data?.company ?? null,
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(
    async (sessionToken: string) => {
      try {
        const response = await fetch("/api/admin/auth/me", {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Oturum doğrulanamadı");
        }

        const data = await response.json();
        setUser(serializeUser(data.user));
        setStatus("authenticated");
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Oturum doğrulanamadı";
        setUser(null);
        setStatus("unauthenticated");
        setError(message);
        setToken(null);
        writeSession(null);
      }
    },
    []
  );

  useEffect(() => {
    const stored = readSession();
    if (!stored?.token) {
      setStatus("unauthenticated");
      return;
    }
    setToken(stored.token);
    fetchProfile(stored.token);
  }, [fetchProfile]);

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      setStatus("loading");
      setError(null);
      try {
        const response = await fetch("/api/admin/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const message =
            data?.error === "forbidden"
              ? "Bu hesap için yönetici yetkisi yok."
              : data?.error === "invalid_credentials"
                ? "Hatalı e-posta veya şifre."
                : "Giriş yapılamadı.";
          setStatus("unauthenticated");
          setUser(null);
          setToken(null);
          setError(message);
          writeSession(null);
          return { ok: false, error: message, status: response.status };
        }

        const sessionToken = String(data.token ?? "");
        setToken(sessionToken);
        writeSession({ token: sessionToken, expiresAt: data.expiresAt });
        const nextUser = serializeUser(data.user);
        setUser(nextUser);
        setStatus("authenticated");
        setError(null);
        return { ok: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Giriş sırasında hata oluştu.";
        setStatus("error");
        setUser(null);
        setToken(null);
        setError(message);
        writeSession(null);
        return { ok: false, error: message };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    const currentToken = readSession()?.token ?? token;
    if (currentToken) {
      try {
        await fetch("/api/admin/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${currentToken}` },
        });
      } catch {
        // ignore logout errors
      }
    }
    writeSession(null);
    setToken(null);
    setUser(null);
    setStatus("unauthenticated");
    setError(null);
  }, [token]);

  const refresh = useCallback(async () => {
    const currentToken = readSession()?.token ?? token;
    if (!currentToken) {
      setStatus("unauthenticated");
      setUser(null);
      return;
    }
    setStatus("loading");
    await fetchProfile(currentToken);
  }, [fetchProfile, token]);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      status,
      user,
      token,
      error,
      login,
      logout,
      refresh,
    }),
    [status, user, token, error, login, logout, refresh]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
};
