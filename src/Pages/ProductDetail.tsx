// src/Pages/ProductDetail.tsx
import { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { siteConfig } from "@/data/site";
import { ExtrasSelector } from "@/Components/Pages/Product/ExtraSelector";
import type { UIExtra, LegacyProduct, Product } from "@/Types/Product";
import {
  productDetailResponseSchema,
  type ZProduct,
} from "@/validation";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://tasodigital.com/api";
const phoneHref = siteConfig.contact.phoneHref || siteConfig.contact.phone;

type State = {
  loading: boolean;
  error: string | null;
  product: Product | null;
};

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-[color:var(--primary-color)] ring-1 ring-indigo-100">
      {label}
    </span>
  );
}
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--primary-color)]" />
    </div>
  );
}
function SectionTitle({ icon, children }: { icon: string; children: string }) {
  return (
    <h3 className="mb-3 flex items-center text-sm font-semibold uppercase tracking-wide text-slate-500">
      <i className={`${icon} mr-2 text-[color:var(--primary-color)]`} />
      {children}
    </h3>
  );
}
function FeatureList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="space-y-2">
      {items.map((label, idx) => (
        <li key={idx} className="flex items-start gap-2 text-slate-600">
          <i className="fas fa-check text-emerald-500 mt-1" />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}
function extractPriceAmount(value?: string | null) {
  if (!value) return 0;
  const digits = value.replace(/[^0-9]/g, "");
  if (!digits) return 0;
  const amount = Number(digits);
  return Number.isFinite(amount) ? amount : 0;
}

function toIso(v: unknown): string | undefined {
  if (!v) return undefined;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "string") return v;
  return undefined;
}

function normalizeProduct(raw: ZProduct, locale: string): Product {
  return {
    id: String(raw.id),
    title: String(raw.title ?? ""),
    description: raw.description ?? null,
    image: raw.image ?? null,
    badge: raw.badge ?? null,
    href: raw.href ?? null,
    category: String(raw.categoryTitle ?? raw.categoryId ?? ""),
    categoryTitle: raw.categoryTitle ?? null,
    price: raw.price ?? null,
    locale,
    created_at: toIso(raw.created_at),
    updated_at: toIso(raw.updated_at),
    // options (UI tarafında UIExtra’ya çevireceğiz, burada sadece taşıyoruz)
    options: Array.isArray(raw.options)
      ? raw.options.map((o) => ({
          id: String(o.id),
          title: String(o.title ?? o.id),
          description: o.description ?? null,
          type: o.type,
          isRequired: !!o.isRequired,
          isRecurring: !!o.isRecurring,
          priceAmount: Number(o.priceAmount ?? 0),
          currency: String(o.currency ?? "TRY"),
          billingPeriod: o.billingPeriod ?? null,
          priceLabel: o.priceLabel ?? null,
          sort: 0,
        }))
      : undefined,
  };
}

type FetchProductResult =
  | { ok: true; item: Product }
  | { ok: false; error: "not_found" | "failed" };

async function fetchProduct(
  productId: string,
  locale: string
): Promise<FetchProductResult> {
  const res = await fetch(
    `${API_BASE_URL}/products/${encodeURIComponent(productId)}?locale=${locale}`
  );
  if (res.status === 404) return { ok: false, error: "not_found" };
  if (!res.ok) return { ok: false, error: "failed" };
  const data = await res.json().catch(() => null);
  const parsed = productDetailResponseSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "failed" };
  return { ok: true, item: normalizeProduct(parsed.data, locale) };
}

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const locale = i18n.language || "tr";

  const [state, setState] = useState<State>({
    loading: true,
    error: null,
    product: null,
  });
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!productId) {
      setState({ loading: false, error: "invalid_id", product: null });
      return;
    }
    let active = true;
    (async () => {
      setState((p) => ({ ...p, loading: true, error: null }));
      try {
        const result = await fetchProduct(productId, locale);
        if (!active) return;
        if (result.ok)
          setState({ loading: false, error: null, product: result.item });
        else setState({ loading: false, error: result.error, product: null });
      } catch {
        if (!active) return;
        setState({ loading: false, error: "failed", product: null });
      }
    })();
    return () => {
      active = false;
    };
  }, [productId, locale]);

  // readonly -> LegacyProduct ile uyum: unknown üzerinden daralt
  const legacyProducts =
    siteConfig.products as unknown as ReadonlyArray<LegacyProduct>;
  const legacyProduct = useMemo<LegacyProduct | undefined>(
    () =>
      state.product
        ? legacyProducts.find((p) => p.id === state.product!.id)
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.product?.id, legacyProducts]
  );

  if (state.loading) {
    return (
      <section className="mx-auto max-w-[800px] px-6 py-20 text-center">
        <div className="rounded-2xl bg-white p-10 shadow-sm ring-1 ring-slate-200">
          <LoadingSpinner />
          <p className="mt-4 text-slate-600">
            {t("products.detail.loading", {
              defaultValue: "Ürün yükleniyor...",
            })}
          </p>
        </div>
      </section>
    );
  }

  if (state.error || !state.product) {
    const notFound = state.error === "not_found";
    return (
      <section className="mx-auto max-w-[800px] px-6 py-20 text-center">
        <div className="rounded-2xl bg-white p-10 shadow-sm ring-1 ring-slate-200">
          <i className="fas fa-box-open text-3xl text-[color:var(--primary-color)]" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-800">
            {notFound
              ? t("products.detail.notFound", {
                  defaultValue: "Ürün bulunamadı",
                })
              : t("products.detail.error", { defaultValue: "Bir hata oluştu" })}
          </h1>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/urunler"
              className="inline-flex items-center rounded-md border border-[color:var(--primary-color)] px-5 py-2 text-sm font-semibold text-[color:var(--primary-color)] hover:bg-indigo-50"
            >
              <i className="fas fa-arrow-left mr-2" />
              {t("products.detail.back", { defaultValue: "Ürünlere dön" })}
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center rounded-md bg-[color:var(--primary-color)] px-5 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              <i className="fas fa-refresh mr-2" />
              {t("products.detail.retry", { defaultValue: "Tekrar Dene" })}
            </button>
          </div>
        </div>
      </section>
    );
  }

  const product = state.product;

  const included =
    legacyProduct?.features
      ?.filter((f) => f.type !== "premium")
      .map((f) => f.label) ?? [];
  const premium =
    legacyProduct?.features
      ?.filter((f) => f.type === "premium")
      .map((f) => f.label) ?? [];

  // API opsiyonları -> UIExtra
  const apiExtras: UIExtra[] =
    (product.options ?? []).map((e: any) => ({
      id: e.id,
      title: e.title,
      description: e.description ?? null,
      type: e.type,
      priceAmount: e.priceAmount ?? 0,
      priceLabel: e.priceLabel ?? null,
    })) ?? [];

  // readonly kaynakları kopyalayarak mutabla hale getir
  const extrasFallback: UIExtra[] = legacyProduct?.extras
    ? [...legacyProduct.extras]
    : [];
  const uiExtras: UIExtra[] = apiExtras.length > 0 ? apiExtras : extrasFallback;

  const basePriceAmount =
    legacyProduct?.priceAmount ?? extractPriceAmount(product.price) ?? 0;
  const extrasTotal = uiExtras
    .filter((e) => selectedExtras.has(e.id))
    .reduce((sum, e) => sum + (e.priceAmount || 0), 0);
  const totalPrice = basePriceAmount + extrasTotal;

  const toggleExtra = (id: string) =>
    setSelectedExtras((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectedExtraLabels = uiExtras
    .filter((e) => selectedExtras.has(e.id))
    .map((e) => e.title)
    .join(", ");
  const purchaseHref = `/iletisim?product=${encodeURIComponent(
    product.title
  )}&extras=${encodeURIComponent(selectedExtraLabels)}`;

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 hover:bg-slate-50"
            >
              <i className="fas fa-arrow-left" />
              {t("products.detail.back", { defaultValue: "Geri dön" })}
            </button>
            <span className="mx-2 text-slate-300">/</span>
            <span className="truncate">{product.category}</span>
          </div>
          <div className="flex items-center gap-2">
            {product.badge && <Badge label={product.badge} />}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="relative max-h-fit w-full">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-200">
                    <i className="fas fa-image text-4xl text-slate-400" />
                  </div>
                )}
                {product.price && (
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[color:var(--primary-color)] ring-1 ring-slate-200">
                    {product.price}
                  </div>
                )}
              </div>
              <div className="space-y-4 p-6">
                <h1 className="text-3xl font-bold text-slate-900">
                  {product.title}
                </h1>
                <p className="leading-relaxed text-slate-600">
                  {product.description ||
                    t("products.detail.noDescription", {
                      defaultValue: "Açıklama bulunmuyor.",
                    })}
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  <section>
                    <SectionTitle icon="fas fa-check-circle">
                      {t("products.detail.included", {
                        defaultValue: "Paket içeriği",
                      })}
                    </SectionTitle>
                    <FeatureList items={included} />
                  </section>
                  <section>
                    <SectionTitle icon="fas fa-crown">
                      {t("products.detail.premium", {
                        defaultValue: "Pro özellikler",
                      })}
                    </SectionTitle>
                    <FeatureList items={premium} />
                  </section>
                </div>
              </div>
            </div>

            {uiExtras.length > 0 && (
              <div className="mt-8">
                <SectionTitle icon="fas fa-sliders-h">
                  {t("products.detail.options", {
                    defaultValue: "Opsiyonel özellikler",
                  })}
                </SectionTitle>
                <ExtrasSelector
                  extras={uiExtras}
                  selected={selectedExtras}
                  onToggle={toggleExtra}
                />
              </div>
            )}
          </div>

          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="sticky" style={{ top: "6.5rem" }}>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  {t("products.detail.summary", {
                    defaultValue: "Sipariş Özeti",
                  })}
                </h2>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>
                      {t("products.detail.base", { defaultValue: "Paket" })}
                    </span>
                    <span>
                      {formatPrice(
                        legacyProduct?.priceAmount ??
                          extractPriceAmount(product.price) ??
                          0
                      )}
                    </span>
                  </div>
                  {uiExtras
                    .filter((e) => selectedExtras.has(e.id))
                    .map((e) => (
                      <div
                        key={e.id}
                        className="flex justify-between text-emerald-600"
                      >
                        <span>{e.title}</span>
                        <span>{formatPrice(e.priceAmount || 0)}</span>
                      </div>
                    ))}
                  <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                    <span>
                      {t("products.detail.total", { defaultValue: "Toplam" })}
                    </span>
                    <span>
                      {formatPrice(
                        (legacyProduct?.priceAmount ??
                          extractPriceAmount(product.price) ??
                          0) +
                          uiExtras
                            .filter((e) => selectedExtras.has(e.id))
                            .reduce((s, e) => s + (e.priceAmount || 0), 0)
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3">
                  <a
                    href={`tel:${phoneHref}`}
                    className="inline-flex items-center justify-center rounded-md bg-[color:var(--primary-color)] px-5 py-2.5 font-semibold text-white hover:opacity-95"
                  >
                    <i className="fas fa-phone mr-2" />
                    {t("products.detail.callNow", {
                      defaultValue: "Şimdi Ara",
                    })}
                  </a>
                  <a
                    href={`/iletisim?product=${encodeURIComponent(
                      product.title
                    )}&extras=${encodeURIComponent(
                      uiExtras
                        .filter((e) => selectedExtras.has(e.id))
                        .map((e) => e.title)
                        .join(", ")
                    )}`}
                    className="inline-flex items-center justify-center rounded-md border border-[color:var(--primary-color)] px-5 py-2.5 font-semibold text-[color:var(--primary-color)] hover:bg-indigo-50"
                  >
                    <i className="fas fa-shopping-cart mr-2" />
                    {t("products.detail.purchase", {
                      defaultValue: "Satın al",
                    })}
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
