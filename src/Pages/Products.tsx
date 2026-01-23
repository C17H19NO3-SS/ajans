// src/Components/Pages/Product/ProductsPage.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type {
  ProductsLoadingState,
  Product,
  ProductCategory,
} from "@/Types/Product";
import ProductsHero from "@/Components/Pages/Product/Hero";
import CategoryAndSearch from "@/Components/Layout/Category/Search";
import ProductsSection from "@/Components/Pages/Product/Section";
import ProductsCTA from "@/Components/Pages/Product/CTA";
import {
  categoriesResponseSchema,
  productsResponseSchema,
  type ZProduct,
} from "@/validation";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://tasodigital.com/api";
const PAGE_SIZE = 9;

type FetchOk = {
  ok: true;
  items: Product[];
  nextCursor: number | null; // bir sonraki offset
  hasMore: boolean;
};
type FetchErr = { ok: false; error: string };
type FetchResp = FetchOk | FetchErr;

function normalizeProduct(raw: ZProduct, locale: string): Product {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? null,
    image: raw.image ?? null,
    badge: raw.badge ?? null,
    href: raw.href ?? null,
    category: raw.categoryTitle ?? raw.categoryId,
    categoryTitle: raw.categoryTitle ?? null,
    price: raw.price ?? null,
    locale,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    options: raw.options?.map((option) => ({
      id: option.id,
      title: option.title,
      description: option.description ?? null,
      type: option.type,
      isRequired: option.isRequired,
      isRecurring: option.isRecurring,
      priceAmount: option.priceAmount,
      currency: option.currency,
      billingPeriod: option.billingPeriod ?? null,
      priceLabel: option.priceLabel ?? null,
      sort: 0,
    })),
  };
}

async function fetchProducts(
  locale: string,
  category: string,
  query: string,
  offset = 0,
  signal?: AbortSignal
): Promise<FetchResp> {
  const useSearch = !!query && query.trim().length > 0;
  const endpoint = useSearch ? "/products/search" : "/products";

  const params = new URLSearchParams({
    locale,
    limit: String(PAGE_SIZE),
    offset: String(offset),
  });

  if (category && category !== "all") params.append("categoryId", category);
  if (useSearch) params.append("q", query.trim());

  const res = await fetch(`${API_BASE_URL}${endpoint}?${params.toString()}`, {
    signal,
  });
  if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };

  // Beklenen API: { items, total, page, pageSize }
  const data = await res.json().catch(() => null);
  const parsed = productsResponseSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Ge�ersiz yan�t" };

  const items = parsed.data.items.map((item) => normalizeProduct(item, locale));
  const total: number = Number(parsed.data.total ?? 0);
  const hasMore = offset + items.length < total;
  const nextCursor = hasMore ? offset + items.length : null;

  return { ok: true, items, hasMore, nextCursor };
}

async function fetchCategories(_locale: string): Promise<ProductCategory[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories?pageSize=100`);
    if (!res.ok) return [];
    const data = await res.json();
    const parsed = categoriesResponseSchema.safeParse(data);
    if (!parsed.success) return [];
    return parsed.data.items.map((item) => ({
      id: item.id,
      label: item.title ?? item.id,
      icon: item.icon ?? "fas fa-tag",
    }));
  } catch {
    return [];
  }
}

const initialState: ProductsLoadingState = {
  loading: true,
  loadingMore: false,
  error: null,
  products: [],
  nextCursor: null,
  hasMore: false,
};

export default function ProductsPage() {
  const { i18n } = useTranslation("common");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState(initialState);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const locale = i18n.language || "tr";
  const abortRef = useRef<AbortController | null>(null);
  const lastFetchKeyRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const items = await fetchCategories(locale);
      if (!active) return;
      setCategories(items);
    })();
    return () => {
      active = false;
    };
  }, [locale]);

  const loadProducts = useCallback(
    async ({
      search,
      offset = 0,
      append = false,
    }: {
      search: string;
      offset?: number;
      append?: boolean;
    }) => {
      const controller = new AbortController();
      abortRef.current?.abort();
      abortRef.current = controller;

      setState((prev) => ({
        ...prev,
        error: null,
        loading: append ? prev.loading : true,
        loadingMore: append,
        products: append ? prev.products : [],
        nextCursor: append ? prev.nextCursor : null,
        hasMore: append ? prev.hasMore : false,
      }));

      try {
        const res = await fetchProducts(
          locale,
          filter,
          search,
          offset,
          controller.signal
        );

        if (!res.ok) throw new Error(res.error);

        setState((prev) => ({
          loading: false,
          loadingMore: false,
          error: null,
          products: append ? [...prev.products, ...res.items] : res.items,
          nextCursor: res.nextCursor,
          hasMore: res.hasMore,
        }));
      } catch (error) {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : "Hata";
        setState((prev) => ({
          ...prev,
          loading: false,
          loadingMore: false,
          error: message,
        }));
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [filter, locale]
  );

  const fetchKey = `${locale}|${filter}|${query}|${reloadKey}`;

  useEffect(() => {
    if (lastFetchKeyRef.current === fetchKey) return;
    lastFetchKeyRef.current = fetchKey;
    // offset=0 ile başla
    loadProducts({ search: query, offset: 0, append: false });
  }, [fetchKey, loadProducts, query]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const submitSearch = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      setQueryInput(trimmed);
      if (trimmed !== query) setQuery(trimmed);
      else setReloadKey((key) => key + 1);
    },
    [query]
  );

  const handleLoadMore = useCallback(() => {
    if (!state.hasMore || state.loadingMore || state.nextCursor == null) return;
    loadProducts({
      search: query,
      offset: state.nextCursor, // offset tabanlı sayfalama
      append: true,
    });
  }, [state.hasMore, state.loadingMore, state.nextCursor, loadProducts, query]);

  return (
    <main>
      <ProductsHero />
      <CategoryAndSearch
        value={filter}
        onChange={setFilter}
        query={queryInput}
        onQueryChange={setQueryInput}
        onSubmitQuery={(value) => submitSearch(value)}
        categories={categories}
        loading={state.loading && state.products.length === 0}
      />
      <ProductsSection
        products={state.products}
        loading={state.loading}
        loadingMore={state.loadingMore}
        error={state.error}
        hasMore={state.hasMore}
        onLoadMore={handleLoadMore}
      />
      <ProductsCTA />
    </main>
  );
}
