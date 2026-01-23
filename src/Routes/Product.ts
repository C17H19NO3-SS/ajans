// src/Routes/Product.ts
import { Elysia, t } from "elysia";
import type {
  Prisma,
  Product,
  ProductTranslation,
  ProductOption,
  ProductOptionTranslation,
} from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  listImages as fsListImages,
  resolvePrimaryImage as fsResolvePrimaryImage,
} from "@/Utils/ImageUtils";

/** ---------- Schemas ---------- */
const optionSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.Optional(t.Union([t.String(), t.Null()])),
  type: t.String(),
  isRequired: t.Boolean(),
  isRecurring: t.Boolean(),
  priceAmount: t.Number(),
  priceLabel: t.Optional(t.Union([t.String(), t.Null()])),
  currency: t.String(),
  billingPeriod: t.Optional(t.Union([t.String(), t.Null()])),
  sortOrder: t.Number(),
  active: t.Boolean(),
});

const productSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.Optional(t.Union([t.String(), t.Null()])),
  image: t.Optional(t.Union([t.String(), t.Null()])),
  badge: t.Optional(t.Union([t.String(), t.Null()])),
  href: t.Optional(t.Union([t.String(), t.Null()])),
  categoryId: t.Optional(t.String()),
  categoryTitle: t.Optional(t.Union([t.String(), t.Null()])),
  price: t.Optional(t.Union([t.String(), t.Null()])),
  created_at: t.Optional(t.String()),
  updated_at: t.Optional(t.String()),
  options: t.Optional(t.Array(optionSchema)),
});

const productImageRow = t.Object({
  id: t.String(),
  url: t.String(),
  localeCode: t.Nullable(t.String()),
  createdAt: t.String(),
});
const productImagesListResponse = t.Object({
  items: t.Array(productImageRow),
});

const paginated = <T extends ReturnType<typeof t.Object>>(item: T) =>
  t.Object({
    items: t.Array(item),
    total: t.Number(),
    page: t.Number(),
    pageSize: t.Number(),
  });

/** ---------- Utils ---------- */
const toIso = (v: unknown) =>
  v instanceof Date ? v.toISOString() : typeof v === "string" ? v : undefined;

type AnyTranslation = { locale?: string | null; localeCode?: string | null };

const pickTranslation = <T extends AnyTranslation>(
  translations: T[] | undefined,
  locale: string
): T | undefined => {
  if (!translations?.length) return undefined;
  const getLocale = (tr: AnyTranslation) =>
    tr.locale ?? tr.localeCode ?? undefined;
  return (
    translations.find((tr) => getLocale(tr) === locale) ??
    translations.find((tr) => getLocale(tr) === "tr") ??
    translations[0]
  );
};

type ProductWithBase = Product & {
  translations: ProductTranslation[];
  category?: { id: string; title: string | null } | null;
};

const mapProduct = (product: ProductWithBase, locale: string) => {
  const tr = pickTranslation<ProductTranslation>(
    product.translations as any,
    locale
  );
  return {
    id: product.id,
    title: tr?.title ?? product.title ?? "",
    description: tr?.description ?? null,
    image: null, // Görsel fs üstünden çözülür
    badge: null,
    href: null,
    categoryId: product.categoryId ?? undefined,
    categoryTitle: product.category?.title ?? null,
    price: tr?.price ?? product.price ?? null,
    created_at: toIso(product.createdAt),
    updated_at: toIso(product.updatedAt),
  };
};

const mapOption = (
  option: ProductOption & { translations: ProductOptionTranslation[] },
  locale: string
) => {
  const tr = pickTranslation<ProductOptionTranslation>(
    option.translations as any,
    locale
  );
  return {
    id: option.id,
    title: tr?.title ?? option.id,
    description: tr?.description ?? null,
    type: option.type,
    isRequired: option.isRequired,
    isRecurring: option.isRecurring,
    priceAmount: option.priceAmount,
    priceLabel: tr?.priceLabel ?? null,
    currency: option.currency,
    billingPeriod: option.billingPeriod,
    sortOrder: option.sortOrder,
    active: option.active,
  };
};

const pickLocale = (
  headers: Record<string, string | undefined>,
  query: Record<string, unknown>
) => {
  const q = typeof query.locale === "string" ? query.locale : undefined;
  if (q) return q.toLowerCase().startsWith("en") ? "en" : "tr";
  const raw = headers["accept-language"] ?? headers["Accept-Language"] ?? "";
  const m = String(raw).match(/^[a-z]{2}/i);
  const code = m ? m[0].toLowerCase() : "tr";
  return code === "en" ? "en" : "tr";
};

/** ---------- Routes ---------- */
export function ProductRoutes() {
  return (
    new Elysia({ prefix: "/api" })
      // List
      .get(
        "/products",
        async ({ headers, query }) => {
          const locale = pickLocale(headers as any, query as any);
          const page = Math.max(1, Number(query.page ?? 1));
          const pageSizeFromLimit = query.limit
            ? Number(query.limit)
            : undefined;
          const pageSize = Math.min(
            100,
            Math.max(1, Number(query.pageSize ?? pageSizeFromLimit ?? 20))
          );
          const offset =
            query.offset !== undefined
              ? Math.max(0, Number(query.offset))
              : (page - 1) * pageSize;
          const categoryId = query.categoryId ? String(query.categoryId) : null;

          const where: Prisma.ProductWhereInput = categoryId
            ? { deletedAt: null, categoryId }
            : { deletedAt: null };

          const [total, rows] = await Promise.all([
            prisma.product.count({ where }),
            prisma.product.findMany({
              where,
              orderBy: [{ createdAt: "desc" }, { title: "asc" }],
              skip: offset,
              take: pageSize,
              include: {
                category: { select: { id: true, title: true } },
                translations: true,
              },
            }),
          ]);

          const itemsBase = rows.map((row) =>
            mapProduct(row as ProductWithBase, locale)
          );

          const items = await Promise.all(
            itemsBase.map(async (it) => {
              const url = await fsResolvePrimaryImage(it.id, locale);
              return { ...it, image: url ?? null };
            })
          );

          return {
            items,
            total,
            page,
            pageSize,
          };
        },
        {
          query: t.Object({
            page: t.Optional(t.Number({ minimum: 1 })),
            pageSize: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
            limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
            offset: t.Optional(t.Number({ minimum: 0 })),
            categoryId: t.Optional(t.String()),
            locale: t.Optional(t.String()),
          }),
          response: paginated(productSchema),
        }
      )

      // Detail by id
      .get(
        "/products/:id",
        async ({ headers, query, params, set }) => {
          const locale = pickLocale(headers as any, query as any);

          const product = await prisma.product.findFirst({
            where: { id: params.id, deletedAt: null },
            include: {
              category: { select: { id: true, title: true } },
              translations: true,
            },
          });

          if (!product) {
            set.status = 404;
            return null;
          }

          const opts = await prisma.productOption.findMany({
            where: { productId: product.id, active: true },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            include: { translations: true },
          });

          const base = mapProduct(product as ProductWithBase, locale);
          const primaryImage = await fsResolvePrimaryImage(base.id, locale);

          return {
            ...base,
            image: primaryImage ?? null,
            options: opts.map((o) =>
              mapOption(
                o as ProductOption & {
                  translations: ProductOptionTranslation[];
                },
                locale
              )
            ),
          };
        },
        {
          params: t.Object({ id: t.String() }),
          query: t.Object({ locale: t.Optional(t.String()) }),
          response: t.Union([productSchema, t.Null()]),
        }
      )

      // Detail by slug (şu an id ile aynı davranış)
      .get(
        "/products/slug/:slug",
        async ({ headers, query, params, set }) => {
          const locale = pickLocale(headers as any, query as any);

          const product = await prisma.product.findFirst({
            where: { id: params.slug, deletedAt: null },
            include: {
              category: { select: { id: true, title: true } },
              translations: true,
            },
          });

          if (!product) {
            set.status = 404;
            return null;
          }

          const opts = await prisma.productOption.findMany({
            where: { productId: product.id, active: true },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            include: { translations: true },
          });

          const base = mapProduct(product as ProductWithBase, locale);
          const primaryImage = await fsResolvePrimaryImage(base.id, locale);

          return {
            ...base,
            image: primaryImage ?? null,
            options: opts.map((o) =>
              mapOption(
                o as ProductOption & {
                  translations: ProductOptionTranslation[];
                },
                locale
              )
            ),
          };
        },
        {
          params: t.Object({ slug: t.String() }),
          query: t.Object({ locale: t.Optional(t.String()) }),
          response: t.Union([productSchema, t.Null()]),
        }
      )

      // Public images list for a product (locale-aware, FS tabanlı)
      .get(
        "/products/:id/images",
        async ({ params, query }) => {
          const locale =
            typeof query.locale === "string" && query.locale.trim()
              ? query.locale
              : undefined;
          const items = await fsListImages(params.id, locale);
          return { items };
        },
        {
          params: t.Object({ id: t.String() }),
          query: t.Object({ locale: t.Optional(t.String()) }),
          response: productImagesListResponse,
        }
      )

      // Search
      .get(
        "/products/search",
        async ({ headers, query }) => {
          const locale = pickLocale(headers as any, query as any);
          const q = String(query.q ?? "").trim();
          const page = Math.max(1, Number(query.page ?? 1));
          const pageSizeFromLimit = query.limit
            ? Number(query.limit)
            : undefined;
          const pageSize = Math.min(
            100,
            Math.max(1, Number(query.pageSize ?? pageSizeFromLimit ?? 20))
          );
          const offset =
            query.offset !== undefined
              ? Math.max(0, Number(query.offset))
              : (page - 1) * pageSize;
          const categoryId = query.categoryId ? String(query.categoryId) : null;

          if (!q) return { items: [], total: 0, page, pageSize };

          const where: Prisma.ProductWhereInput = {
            AND: [
              { deletedAt: null },
              categoryId ? { categoryId } : {},
              {
                OR: [
                  {
                    translations: {
                      some: {
                        localeCode: { in: [locale, "tr"] },
                        OR: [
                          { title: { contains: q } },
                          { description: { contains: q } },
                        ],
                      },
                    },
                  },
                  { title: { contains: q } },
                ],
              },
            ],
          };

          const [total, rows] = await Promise.all([
            prisma.product.count({ where }),
            prisma.product.findMany({
              where,
              orderBy: [{ createdAt: "desc" }, { title: "asc" }],
              skip: offset,
              take: pageSize,
              include: {
                category: { select: { id: true, title: true } },
                translations: { where: { localeCode: { in: [locale, "tr"] } } },
              },
            }),
          ]);

          const itemsBase = rows.map((row) =>
            mapProduct(row as ProductWithBase, locale)
          );
          const items = await Promise.all(
            itemsBase.map(async (it) => {
              const url = await fsResolvePrimaryImage(it.id, locale);
              return { ...it, image: url ?? null };
            })
          );

          return {
            items,
            total,
            page,
            pageSize,
          };
        },
        {
          query: t.Object({
            q: t.String(),
            page: t.Optional(t.Number({ minimum: 1 })),
            pageSize: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
            limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
            offset: t.Optional(t.Number({ minimum: 0 })),
            categoryId: t.Optional(t.String()),
            locale: t.Optional(t.String()),
          }),
          response: paginated(productSchema),
        }
      )
  );
}
