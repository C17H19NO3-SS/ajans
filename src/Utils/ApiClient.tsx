// src/api/ApiClient.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type Query = Record<
  string,
  string | number | boolean | undefined | null
>;

export interface ApiClientOptions {
  baseURL: string;
  getToken?: () => string | null | undefined;
  getLang?: () => string | null | undefined; // i18n
  timeoutMs?: number; // fetch timeout
  cacheMaxEntries?: number; // GET cache üst sınırı
  onRequest?: (input: {
    method: HttpMethod;
    url: string;
    init: RequestInit;
  }) => void;
  onResponse?: (input: { response: Response; cloned: Response }) => void;
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Proje tiplerinizi buradan içe alın.
import type { Category } from "@/Types/Category";
import type { Product } from "@/Types/Product";
import type { SystemHealth as System } from "@/Types/SystemHealth";
import type { User } from "@/Types/User";

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

type ReqOpts = {
  query?: Query;
  body?: any;
  headers?: HeadersInit;
  signal?: AbortSignal;
  auth?: boolean; // Authorization ekle
  cacheTtlMs?: number; // sadece GET
  retry?: number; // sadece GET (varsayılan 2)
};

export default class ApiClient {
  private baseURL: string;
  private getToken?: ApiClientOptions["getToken"];
  private getLang?: ApiClientOptions["getLang"];
  private timeoutMs: number;
  private cacheMaxEntries: number;
  private onRequest?: ApiClientOptions["onRequest"];
  private onResponse?: ApiClientOptions["onResponse"];

  // basit bellek önbelleği
  private cache = new Map<string, { exp: number; data: unknown }>();
  // eşzamanlı GET istek birleştirme
  private inflight = new Map<string, Promise<unknown>>();

  constructor(opts: ApiClientOptions) {
    this.baseURL = opts.baseURL.replace(/\/+$/, "");
    this.getToken = opts.getToken;
    this.getLang = opts.getLang;
    this.timeoutMs = opts.timeoutMs ?? 15000;
    this.cacheMaxEntries = Math.max(1, opts.cacheMaxEntries ?? 200);
    this.onRequest = opts.onRequest;
    this.onResponse = opts.onResponse;
  }

  // ---------- KULLANICI MODÜLÜ ----------
  users = {
    login: <T = { token: string; user: User },>(payload: {
      identifier: string;
      password: string;
    }) => this.post<T>("/auth/login", { body: payload, auth: false }),
    register: <T = { token: string; user: User },>(
      payload: Partial<User> & { password: string }
    ) => this.post<T>("/auth/register", { body: payload, auth: false }),
    me: <T = User,>() => this.get<T>("/auth/me"),
    logout: <T = { ok: true },>() =>
      this.post<T>("/auth/logout", { body: {}, auth: true }),
  };

  // ---------- KATEGORİ MODÜLÜ ----------
  categories = {
    list: (q?: Query) =>
      this.get<Paginated<Category>>("/categories", {
        query: q,
        cacheTtlMs: 60_000,
      }),
    byId: (id: string | number) =>
      this.get<Category>(`/categories/${id}`, { cacheTtlMs: 60_000 }),
    bySlug: (slug: string) =>
      this.get<Category>(`/categories/slug/${encodeURIComponent(slug)}`, {
        cacheTtlMs: 60_000,
      }),
  };

  // ---------- ÜRÜN MODÜLÜ ----------
  products = {
    list: (q?: Query) =>
      this.get<Paginated<Product>>("/products", { query: q }),
    byId: (id: string | number) => this.get<Product>(`/products/${id}`),
    bySlug: (slug: string) =>
      this.get<Product>(`/products/slug/${encodeURIComponent(slug)}`),
    search: (q: string, extra?: Query) =>
      this.get<Paginated<Product>>("/products/search", {
        query: { q, ...extra },
      }),
  };

  // ---------- SİSTEM MODÜLÜ ----------
  system = {
    info: () => this.get<System>("/system/info", { cacheTtlMs: 5 * 60_000 }),
    health: () =>
      this.get<{ status: "ok" | "degraded" | "down" }>("/system/health", {
        cacheTtlMs: 10_000,
      }),
  };

  // ---------- TEMEL İSTEK YARDIMCILARI ----------
  get<T>(path: string, opts: ReqOpts = {}) {
    return this.request<T>("GET", path, opts);
  }
  post<T>(path: string, opts: ReqOpts = {}) {
    return this.request<T>("POST", path, opts);
  }
  put<T>(path: string, opts: ReqOpts = {}) {
    return this.request<T>("PUT", path, opts);
  }
  patch<T>(path: string, opts: ReqOpts = {}) {
    return this.request<T>("PATCH", path, opts);
  }
  delete<T>(path: string, opts: ReqOpts = {}) {
    return this.request<T>("DELETE", path, opts);
  }

  // Önbelleği ısıt
  prefetch(
    path: string,
    opts: Omit<ReqOpts, "retry"> & { cacheTtlMs: number }
  ) {
    return this.get(path, opts).then(() => undefined);
  }
  // Önbellek temizleme
  invalidate(predicate?: (key: string) => boolean) {
    if (!predicate) this.cache.clear();
    else
      for (const k of Array.from(this.cache.keys()))
        if (predicate(k)) this.cache.delete(k);
  }

  // ---------- ÇEKİRDEK ----------
  private async request<T>(
    method: HttpMethod,
    path: string,
    opts: ReqOpts
  ): Promise<T> {
    const url = this.buildURL(path, opts.query);
    const isGet = method === "GET";
    const lang = this.getLang?.() || "";
    const token = opts.auth === false ? null : this.getToken?.() || null;
    // auth ve dil varyantını da anahtara dahil et
    const cacheKey = isGet
      ? `${url}::auth=${token ? 1 : 0}::lang=${lang || "none"}`
      : "";

    // GET önbellek oku
    if (isGet && opts.cacheTtlMs && this.cache.has(cacheKey)) {
      const hit = this.cache.get(cacheKey)!;
      if (hit.exp > Date.now()) return hit.data as T;
      this.cache.delete(cacheKey);
    }

    // Eşzamanlı aynı istek varsa bekle
    if (isGet && this.inflight.has(cacheKey)) {
      return this.inflight.get(cacheKey)! as Promise<T>;
    }

    const makeFetch = async (): Promise<T> => {
      // Zaman aşımı sinyali
      const timeoutCtrl = new AbortController();
      const timeoutId = setTimeout(() => timeoutCtrl.abort(), this.timeoutMs);

      const headers: HeadersInit = {
        Accept: "application/json",
        ...(opts.body ? { "Content-Type": "application/json" } : {}),
        ...(opts.headers || {}),
      };

      if (lang) (headers as Record<string, string>)["Accept-Language"] = lang;
      if (token)
        (headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${token}`;

      const init: RequestInit = {
        method,
        headers,
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        // AbortSignal.any destekliyse kullan
        signal:
          (AbortSignal as any)?.any?.(
            [timeoutCtrl.signal, opts.signal].filter(Boolean)
          ) ?? this.linkSignals(timeoutCtrl.signal, opts.signal),
        credentials: "include",
      };

      this.onRequest?.({ method, url, init });

      let res: Response;
      try {
        res = await fetch(url, init);
      } finally {
        clearTimeout(timeoutId);
      }

      const cloned = res.clone();
      this.onResponse?.({ response: res, cloned });

      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const data = isJson
        ? await res.json().catch(() => null)
        : await res.text();

      if (!res.ok) {
        const msg =
          (isJson && (data?.message || data?.error)) ||
          res.statusText ||
          "Sunucu hatası";
        // Retry kararını dışarı verelim
        throw new ApiError(String(msg), res.status, data);
      }

      // GET önbellek yaz
      if (isGet && opts.cacheTtlMs) {
        // LRU: sınırı aşarsa en eskiyi sil
        if (this.cache.size >= this.cacheMaxEntries) {
          const first = this.cache.keys().next().value;
          if (first) this.cache.delete(first);
        }
        this.cache.set(cacheKey, { exp: Date.now() + opts.cacheTtlMs, data });
      }

      return data as T;
    };

    const run = async (): Promise<T> => {
      const maxRetry = isGet ? Math.max(0, opts.retry ?? 2) : 0;
      let attempt = 0;
      // İlk deneme + tekrarlar
      while (true) {
        try {
          return await makeFetch();
        } catch (e: any) {
          const status = e instanceof ApiError ? e.status : 0;
          const retryable =
            isGet &&
            (status === 408 ||
              status === 429 ||
              (status >= 500 && status <= 599));
          if (!(retryable && attempt < maxRetry)) throw e;
          const backoff = this.backoffMs(attempt);
          await this.sleep(backoff);
          attempt++;
        }
      }
    };

    const p = run();

    if (isGet) {
      this.inflight.set(cacheKey, p as Promise<unknown>);
      try {
        const out = await p;
        return out;
      } finally {
        this.inflight.delete(cacheKey);
      }
    } else {
      return p;
    }
  }

  private buildURL(path: string, query?: Query) {
    const url = new URL(
      this.baseURL + (path.startsWith("/") ? path : `/${path}`)
    );
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v === undefined || v === null) continue;
        url.searchParams.set(k, String(v));
      }
    }
    return url.toString();
  }

  // Fallback sinyal birleştirme
  private linkSignals(a: AbortSignal, b?: AbortSignal) {
    if (!b) return a;
    const ctrl = new AbortController();
    const onAbortA = () => ctrl.abort();
    const onAbortB = () => ctrl.abort();
    a.addEventListener("abort", onAbortA);
    b.addEventListener("abort", onAbortB);
    // cleanup mümkün değil; kısa ömürlü olduğu için kabul edilebilir
    return ctrl.signal;
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
  private backoffMs(attempt: number) {
    // 200ms, 400ms, 800ms + küçük jitter
    const base = 200 * Math.pow(2, attempt);
    const jitter = Math.floor(Math.random() * 50);
    return base + jitter;
  }
}

export const api = new ApiClient({
  baseURL: import.meta.env.VITE_API_URL ?? "https://api.example.com",
  getToken: () => localStorage.getItem("token"),
  getLang: () => localStorage.getItem("i18nextLng") ?? "tr",
});
