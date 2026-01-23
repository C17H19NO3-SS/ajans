// src/Routes/Admin.ts
import { Elysia, t } from "elysia";
import prisma from "@/lib/prisma";
import { createHmac, randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { listImages, saveImage } from "@/Utils/ImageUtils";

const JWT_TTL_MS = 1000 * 60 * 60 * 24;
const JWT_SECRET =
  process.env.ADMIN_JWT_SECRET ??
  process.env.JWT_SECRET ??
  "change-this-secret-in-production";

const DEFAULT_LOCALE = (process.env.DEFAULT_LOCALE ?? "tr").toLowerCase();
const DEFAULT_CURRENCY = process.env.DEFAULT_CURRENCY ?? "TRY";

/** ------------ Schemas (Değişiklik Yok) ------------ */
const loginBody = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6 }),
});

const simpleError = t.Object({
  ok: t.Literal(false),
  error: t.String(),
  ip: t.Optional(t.String()),
});

const authSuccessResponse = t.Object({
  ok: t.Literal(true),
  token: t.String(),
  expiresAt: t.String({ format: "date-time" }),
  user: t.Object({
    id: t.String(),
    email: t.String(),
    firstName: t.Nullable(t.String()),
    lastName: t.Nullable(t.String()),
    position: t.Nullable(t.String()),
    company: t.Nullable(t.String()),
  }),
});

const dashboardResponse = t.Object({
  stats: t.Object({
    totalProducts: t.Number(),
    totalUsers: t.Number(),
    totalOrders: t.Number(),
    activeSessions: t.Number(),
  }),
  latestProducts: t.Array(
    t.Object({
      id: t.String(),
      title: t.String(),
      category: t.Nullable(t.String()),
      updatedAt: t.String(),
    })
  ),
  latestUsers: t.Array(
    t.Object({
      id: t.String(),
      name: t.String(),
      email: t.String(),
      createdAt: t.String(),
    })
  ),
});

const categoryListResponse = t.Array(
  t.Object({
    id: t.String(),
    title: t.String(),
  })
);

const productRowSchema = t.Object({
  id: t.String(),
  title: t.String(),
  status: t.String(),
  price: t.Nullable(t.String()),
  categoryId: t.Nullable(t.String()),
  category: t.Nullable(t.String()),
  updatedAt: t.String(),
});

const productsListResponse = t.Object({
  items: t.Array(productRowSchema),
});

const userRowSchema = t.Object({
  id: t.String(),
  email: t.String(),
  name: t.String(),
  company: t.Nullable(t.String()),
  position: t.Nullable(t.String()),
  createdAt: t.String(),
});

const usersListResponse = t.Object({
  items: t.Array(userRowSchema),
});

const productTranslationInput = t.Object({
  localeCode: t.String({ minLength: 2, maxLength: 8 }),
  title: t.Optional(t.Union([t.String(), t.Null()])),
  price: t.Optional(t.Union([t.String(), t.Null()])),
  description: t.Optional(t.Union([t.String(), t.Null()])),
});

const productTranslationRow = t.Object({
  localeCode: t.String(),
  title: t.String(),
  price: t.Nullable(t.String()),
  description: t.Nullable(t.String()),
});

const productTranslationsListResponse = t.Object({
  items: t.Array(productTranslationRow),
});

const productCreateBody = t.Object({
  title: t.String({ minLength: 1 }),
  price: t.Optional(t.Union([t.String(), t.Null()])),
  categoryId: t.String(),
  status: t.Optional(t.Union([t.Literal("published"), t.Literal("archived")])),
  description: t.Optional(t.Union([t.String(), t.Null()])),
  translations: t.Optional(t.Array(productTranslationInput)),
});

const productUpdateBody = t.Object({
  title: t.Optional(t.String({ minLength: 1 })),
  price: t.Optional(t.Union([t.String(), t.Null()])),
  categoryId: t.Optional(t.String()),
  status: t.Optional(t.Union([t.Literal("published"), t.Literal("archived")])),
  description: t.Optional(t.Union([t.String(), t.Null()])),
  translations: t.Optional(t.Array(productTranslationInput)),
});

const purchaseItemInput = t.Object({
  productId: t.Optional(t.String()),
  title: t.Optional(t.String()),
  quantity: t.Number({ minimum: 1 }),
  unitPrice: t.Number(),
});

const purchaseCreateBody = t.Object({
  userId: t.String(),
  items: t.Array(purchaseItemInput, { minItems: 1 }),
  notes: t.Optional(t.String()),
  currency: t.Optional(t.String()),
});

const purchaseItemRow = t.Object({
  id: t.String(),
  productId: t.Nullable(t.String()),
  title: t.String(),
  quantity: t.Number(),
  unitPrice: t.Number(),
  currency: t.String(),
  createdAt: t.String(),
});

const purchaseRowSchema = t.Object({
  id: t.String(),
  userId: t.String(),
  orderNumber: t.String(),
  totalAmount: t.Number(),
  currency: t.String(),
  status: t.String(),
  createdAt: t.String(),
  updatedAt: t.String(),
  items: t.Array(purchaseItemRow),
});

const purchasesListResponse = t.Object({
  items: t.Array(
    t.Object({
      id: t.String(),
      userId: t.String(),
      orderNumber: t.String(),
      totalAmount: t.Number(),
      currency: t.String(),
      status: t.String(),
      createdAt: t.String(),
      updatedAt: t.String(),
    })
  ),
});

const productsBulkDeleteBody = t.Object({
  ids: t.Array(t.String(), { minItems: 1 }),
});
const productsBulkDeleteResponse = t.Object({
  ok: t.Literal(true),
  updated: t.Number(),
  ids: t.Array(t.String()),
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

/** ------------ Helpers ------------ */
const err = (error: string, ip?: string | null) => ({
  ok: false as const,
  error,
  ...(ip ? { ip } : {}),
});

const toIso = (value: Date | string | null | undefined) => {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf())
    ? new Date().toISOString()
    : parsed.toISOString();
};

const mapProductRow = (product: any) => {
  const tr = product.translations?.[0];
  return {
    id: product.id,
    title: tr?.title ?? product.title ?? "Unnamed product",
    status: product.deletedAt ? "archived" : "published",
    price: tr?.price ?? product.price ?? null,
    categoryId: product.category?.id ?? product.categoryId ?? null,
    category: product.category?.title ?? null,
    updatedAt: toIso(product.updatedAt ?? product.createdAt),
  };
};

const base64UrlEncode = (input: Buffer | string) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const base64UrlDecode = (input: string) => {
  const pad = input.length % 4;
  const normalized =
    input.replace(/-/g, "+").replace(/_/g, "/") +
    (pad ? "=".repeat(4 - pad) : "");
  return Buffer.from(normalized, "base64").toString("utf8");
};

const signAdminJwt = (userId: string, email?: string | null) => {
  const header = { alg: "HS256", typ: "JWT" };
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAtSeconds = issuedAt + Math.floor(JWT_TTL_MS / 1000);
  const payload = {
    sub: userId,
    email: email ?? undefined,
    iat: issuedAt,
    exp: expiresAtSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = base64UrlEncode(
    createHmac("sha256", JWT_SECRET).update(signingInput).digest()
  );

  return {
    token: `${signingInput}.${signature}`,
    expiresAt: new Date(expiresAtSeconds * 1000),
  };
};

const verifyAdminJwt = (token: string) => {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encodedHeader, encodedPayload, signature] = parts as [
    string,
    string,
    string
  ];
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = base64UrlEncode(
    createHmac("sha256", JWT_SECRET).update(signingInput).digest()
  );
  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as {
      sub: string;
      email?: string;
      iat: number;
      exp: number;
    };
    if (!payload?.sub || typeof payload.exp !== "number") return null;
    if (Date.now() >= payload.exp * 1000) return null;
    return payload;
  } catch {
    return null;
  }
};

const resolveSession = async (headers: Record<string, string | undefined>) => {
  const authHeader = headers["authorization"] ?? headers["Authorization"];
  if (!authHeader) return null;
  const [scheme, value] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !value) return null;

  const token = value.trim();
  const payload = verifyAdminJwt(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) return null;

  return { token, user };
};

const mapPurchaseItemRow = (it: any) => ({
  id: it.id,
  productId: it.productId ?? null,
  title: it.title,
  quantity: it.quantity,
  unitPrice: it.unitPrice,
  currency: it.currency,
  createdAt: toIso(it.createdAt),
});

/**
 * IP Kontrolü için Helper
 */
const checkIPAccess = async (userIp: string) => {
  // Eğer IP 'unknown' veya localhost ise development için izin ver
  // (whitelist tablosuna 127.0.0.1 eklemeyi unutma)
  if (!userIp) return { allowed: false, ip: "unknown" };

  const entry = await prisma.adminWhitelist.findFirst({
    where: { ip: userIp },
  });

  return {
    allowed: !!entry,
    ip: userIp,
  };
};

/** ------------ Routes ------------ */
export function AdminRoutes() {
  return (
    new Elysia({ prefix: "/api/admin" })
      // Custom IP Derivation
      .derive(({ request, server }) => {
        // 1. Proxy/Docker Headerları (X-Forwarded-For)
        let ip = request.headers.get("x-forwarded-for");
        if (ip) {
          // Birden fazla IP varsa ilki istemcidir (Client, Proxy1, Proxy2...)
          ip = (ip.split(",")[0] as string).trim();
        }

        // 2. Bun Server Socket IP (Localhost fallback)
        if (!ip && server) {
          ip = server.requestIP(request)?.address;
        }

        // 3. Fallback (Hiçbiri bulunamazsa localhost varsayalım ki kod patlamasın)
        // Eğer prodüksiyonda kesin IP istiyorsanız burayı null yapın.
        if (!ip) {
          ip = "127.0.0.1";
        }

        return { ip };
      })

      // ---------- AUTH ----------
      .post(
        "/auth/login",
        async ({ body, set, ip }) => {
          const { allowed, ip: checkedIp } = await checkIPAccess(ip);
          console.log("Login Attempt IP:", checkedIp);

          if (!allowed) {
            set.status = 404; // Güvenlik için 404
            return err("not_found", checkedIp);
          }

          const email = body.email.trim().toLowerCase();
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            set.status = 403;
            return err("forbidden");
          }

          const valid = await bcrypt.compare(body.password, user.passwordHash);
          if (!valid) {
            set.status = 401;
            return err("invalid_credentials");
          }

          const { token, expiresAt } = signAdminJwt(user.id, user.email);
          return {
            ok: true as const,
            token,
            expiresAt: expiresAt.toISOString(),
            user: {
              id: user.id,
              email: user.email ?? "",
              firstName: user.firstName,
              lastName: user.lastName,
              position: user.position,
              company: user.company,
            },
          };
        },
        {
          body: loginBody,
          response: {
            200: authSuccessResponse,
            401: simpleError,
            403: simpleError,
            404: simpleError,
          },
        }
      )
      .get(
        "/auth/me",
        async ({ headers, set, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }
          return {
            ok: true as const,
            user: {
              id: session.user.id,
              email: session.user.email ?? "",
              firstName: session.user.firstName,
              lastName: session.user.lastName,
              position: session.user.position,
              company: session.user.company,
            },
          };
        },
        {
          response: {
            200: t.Object({
              ok: t.Literal(true),
              user: authSuccessResponse.properties.user,
            }),
            401: simpleError,
            404: simpleError,
          },
        }
      )
      .post(
        "/auth/logout",
        async ({ headers, set, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }
          return { ok: true as const };
        },
        {
          response: {
            200: t.Object({ ok: t.Literal(true) }),
            401: simpleError,
            404: simpleError,
          },
        }
      )

      // ---------- DASHBOARD ----------
      .get(
        "/dashboard/overview",
        async ({ headers, set, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const [totalProducts, totalUsers, totalOrders] = await Promise.all([
            prisma.product.count({ where: { deletedAt: null } }),
            prisma.user.count(),
            prisma.purchase.count(),
          ]);
          const activeSessions = Math.max(1, Math.min(totalUsers, 10));

          const [latestProducts, latestUsers] = await Promise.all([
            prisma.product.findMany({
              include: {
                translations: { where: { localeCode: DEFAULT_LOCALE } },
                category: true,
              },
              where: { deletedAt: null },
              orderBy: { updatedAt: "desc" },
              take: 5,
            }),
            prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
          ]);

          return {
            stats: { totalProducts, totalUsers, totalOrders, activeSessions },
            latestProducts: latestProducts.map((p) => ({
              id: p.id,
              title: p.translations?.[0]?.title ?? p.title ?? "Unnamed product",
              category: p.category?.title ?? null,
              updatedAt: (p.updatedAt ?? p.createdAt).toISOString(),
            })),
            latestUsers: latestUsers.map((u) => ({
              id: u.id,
              name:
                [u.firstName, u.lastName].filter(Boolean).join(" ") ||
                u.email ||
                "",
              email: u.email ?? "",
              createdAt: u.createdAt.toISOString(),
            })),
          };
        },
        {
          response: {
            200: dashboardResponse,
            401: simpleError,
            404: simpleError,
          },
        }
      )

      // ---------- CATEGORIES ----------
      .get(
        "/categories",
        async ({ headers, set, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const categories = await prisma.category.findMany({
            where: { deletedAt: null },
            orderBy: { title: "asc" },
            select: { id: true, title: true },
          });
          return categories;
        },
        {
          response: {
            200: categoryListResponse,
            401: simpleError,
            404: simpleError,
          },
        }
      )

      // ---------- PRODUCTS: LIST ----------
      .get(
        "/products",
        async ({ headers, set, query, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const limit = Math.min(
            100,
            Math.max(1, Number(query.limit ?? query.pageSize ?? 20))
          );
          const products = await prisma.product.findMany({
            include: {
              translations: { where: { localeCode: DEFAULT_LOCALE } },
              category: true,
            },
            where: { deletedAt: null },
            orderBy: { updatedAt: "desc" },
            take: limit,
          });
          return {
            items: products.map((p) => ({
              id: p.id,
              title: p.translations?.[0]?.title ?? p.title ?? "Unnamed product",
              status: p.deletedAt ? "archived" : "published",
              price: p.translations?.[0]?.price ?? p.price ?? null,
              categoryId: p.category?.id ?? p.categoryId ?? null,
              category: p.category?.title ?? null,
              updatedAt: (p.updatedAt ?? p.createdAt).toISOString(),
            })),
          };
        },
        {
          query: t.Object({
            limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
            pageSize: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
          }),
          response: {
            200: productsListResponse,
            401: simpleError,
            404: simpleError,
          },
        }
      )

      // ---------- PRODUCTS: DETAIL ----------
      .get(
        "/products/:id",
        async ({ headers, set, params, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const product = await prisma.product.findUnique({
            where: { id: params.id },
            include: {
              translations: { where: { localeCode: DEFAULT_LOCALE } },
              category: true,
            },
          });
          if (!product) {
            set.status = 404;
            return err("not_found", ip);
          }
          return mapProductRow(product);
        },
        {
          params: t.Object({ id: t.String() }),
          response: {
            200: productRowSchema,
            401: simpleError,
            404: simpleError,
          },
        }
      )

      // ---------- PRODUCTS: TRANSLATIONS ----------
      .get(
        "/products/:id/translations",
        async ({ headers, set, params, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const product = await prisma.product.findUnique({
            where: { id: params.id },
            select: { id: true },
          });
          if (!product) {
            set.status = 404;
            return err("not_found", ip);
          }

          const trs = await prisma.productTranslation.findMany({
            where: { productId: params.id },
            orderBy: { localeCode: "asc" },
            select: {
              localeCode: true,
              title: true,
              price: true,
              description: true,
            },
          });

          return {
            items: trs.map((r) => ({
              localeCode: r.localeCode,
              title: r.title ?? "",
              price: r.price,
              description: r.description,
            })),
          };
        },
        {
          params: t.Object({ id: t.String() }),
          response: {
            200: productTranslationsListResponse,
            401: simpleError,
            404: simpleError,
          },
        }
      )

      // ---------- PRODUCTS: IMAGES ----------
      .get(
        "/products/:id/images",
        async ({ headers, set, params, query, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const prod = await prisma.product.findUnique({
            where: { id: params.id },
            select: { id: true },
          });
          if (!prod) {
            set.status = 404;
            return err("not_found", ip);
          }

          const locale =
            typeof query.locale === "string" && query.locale.trim()
              ? query.locale
              : undefined;

          const items = await listImages(params.id, locale);
          return {
            items: items.map((it) => ({
              ...it,
              createdAt:
                typeof it.createdAt === "string"
                  ? it.createdAt
                  : new Date(it.createdAt as any).toISOString(),
            })),
          };
        },
        {
          params: t.Object({ id: t.String() }),
          query: t.Object({ locale: t.Optional(t.String()) }),
          response: {
            200: productImagesListResponse,
            401: simpleError,
            404: simpleError,
          },
        }
      )
      .post(
        "/products/:id/images",
        async ({ headers, set, params, request, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const form = await (request as Request).formData();
          const file = form.get("image") as File | null;
          const locale = (form.get("locale") as string | null) ?? null;
          if (!file) {
            set.status = 400;
            return err("missing_file");
          }

          const prod = await prisma.product.findUnique({
            where: { id: params.id },
            select: { id: true },
          });
          if (!prod) {
            set.status = 404;
            return err("product_not_found");
          }

          const saved = await saveImage(params.id, file, locale);
          return {
            ...saved,
            createdAt:
              typeof (saved as any).createdAt === "string"
                ? (saved as any).createdAt
                : new Date((saved as any).createdAt).toISOString(),
          };
        },
        {
          params: t.Object({ id: t.String() }),
          response: {
            200: productImageRow,
            400: simpleError,
            401: simpleError,
            404: simpleError,
          },
        }
      )

      // ---------- PRODUCTS: CREATE ----------
      .post(
        "/products",
        async ({ headers, set, body, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          if (!body.title || !body.title.trim()) {
            set.status = 400;
            return err("validation_error", "title_required");
          }
          if (!body.categoryId) {
            set.status = 400;
            return err("category_required");
          }

          const createTranslations = [
            {
              localeCode: DEFAULT_LOCALE,
              title: body.title,
              price: body.price ?? null,
              description: body.description ?? null,
            },
            ...(body.translations ?? [])
              .filter((t) => t && typeof t.localeCode === "string")
              .map((t) => ({ ...t, localeCode: t.localeCode.toLowerCase() }))
              .filter((t) => t.localeCode !== DEFAULT_LOCALE.toLowerCase())
              .filter(
                (t, idx, arr) =>
                  arr.findIndex((x) => x.localeCode === t.localeCode) === idx
              )
              .map((t) => ({
                localeCode: t.localeCode,
                title: t.title ?? body.title,
                price: t.price ?? body.price ?? null,
                description:
                  t.description ??
                  (body.description === undefined ? null : body.description),
              })),
          ];

          const created = await prisma.product.create({
            data: {
              id: randomUUID(),
              title: body.title,
              price: body.price ?? null,
              deletedAt: body.status === "archived" ? new Date() : null,
              category: { connect: { id: body.categoryId } },
              translations: { create: createTranslations },
            },
          });

          const full = await prisma.product.findUnique({
            where: { id: created.id },
            include: {
              translations: { where: { localeCode: DEFAULT_LOCALE } },
              category: true,
            },
          });

          return mapProductRow(full);
        },
        {
          body: productCreateBody,
          response: {
            200: productRowSchema,
            400: simpleError,
            401: simpleError,
            404: simpleError,
          },
        }
      )

      // ---------- PRODUCTS: UPDATE ----------
      .put(
        "/products/:id",
        async ({ headers, set, params, body, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const deletedAtUpdate =
            body.status === undefined
              ? undefined
              : body.status === "archived"
              ? new Date()
              : null;

          const product = await prisma.product.update({
            where: { id: params.id },
            data: {
              title: body.title ?? undefined,
              price: body.price === undefined ? undefined : body.price,
              deletedAt: deletedAtUpdate,
              ...(body.categoryId
                ? { category: { connect: { id: body.categoryId } } }
                : {}),
            },
          });

          if (
            body.title !== undefined ||
            body.price !== undefined ||
            body.description !== undefined
          ) {
            await prisma.productTranslation.upsert({
              where: {
                productId_localeCode: {
                  productId: product.id,
                  localeCode: DEFAULT_LOCALE,
                },
              },
              update: {
                title: body.title ?? undefined,
                price: body.price === undefined ? undefined : body.price,
                description:
                  body.description === undefined ? undefined : body.description,
              },
              create: {
                productId: product.id,
                localeCode: DEFAULT_LOCALE,
                title: body.title ?? product.title ?? "Unnamed product",
                price: body.price ?? null,
                description:
                  body.description === undefined ? null : body.description,
              },
            });
          }

          if (
            Array.isArray(body.translations) &&
            body.translations.length > 0
          ) {
            const uniq = body.translations.filter(
              (t, idx, arr) =>
                arr.findIndex(
                  (x) =>
                    x.localeCode.toLowerCase() === t.localeCode.toLowerCase()
                ) === idx
            );
            for (const tr of uniq) {
              const lc = tr.localeCode.toLowerCase();
              await prisma.productTranslation.upsert({
                where: {
                  productId_localeCode: {
                    productId: product.id,
                    localeCode: lc,
                  },
                },
                update: {
                  title: tr.title ?? undefined,
                  price: tr.price === undefined ? undefined : tr.price,
                  description:
                    tr.description === undefined ? undefined : tr.description,
                },
                create: {
                  productId: product.id,
                  localeCode: lc,
                  title:
                    tr.title ??
                    body.title ??
                    product.title ??
                    "Unnamed product",
                  price:
                    tr.price ?? (body.price === undefined ? null : body.price),
                  description:
                    tr.description ??
                    (body.description === undefined ? null : body.description),
                },
              });
            }
          }

          const updated = await prisma.product.findUnique({
            where: { id: params.id },
            include: {
              translations: { where: { localeCode: DEFAULT_LOCALE } },
              category: true,
            },
          });
          if (!updated) {
            set.status = 404;
            return err("not_found", ip);
          }
          return mapProductRow(updated);
        },
        {
          params: t.Object({ id: t.String() }),
          body: productUpdateBody,
          response: {
            200: productRowSchema,
            401: simpleError,
            404: simpleError,
          },
        }
      )

      // ---------- PRODUCTS: DELETE (SOFT) ----------
      .delete(
        "/products/:id",
        async ({ headers, set, params, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const updated = await prisma.product.update({
            where: { id: params.id },
            data: { deletedAt: new Date() },
            include: {
              translations: { where: { localeCode: DEFAULT_LOCALE } },
              category: true,
            },
          });
          return mapProductRow(updated);
        },
        {
          params: t.Object({ id: t.String() }),
          response: {
            200: productRowSchema,
            401: simpleError,
            404: simpleError,
          },
        }
      )

      // ---------- PRODUCTS: BULK DELETE ----------
      .post(
        "/products/bulk-delete",
        async ({ headers, set, body, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const inputIds = Array.from(
            new Set((body.ids ?? []).filter(Boolean))
          );
          if (inputIds.length === 0) {
            set.status = 400;
            return err("no_ids");
          }

          const res = await prisma.product.updateMany({
            where: {
              id: { in: inputIds },
              OR: [{ deletedAt: null }, { deletedAt: { equals: null } }],
            },
            data: { deletedAt: new Date() },
          });

          return { ok: true as const, updated: res.count, ids: inputIds };
        },
        {
          body: productsBulkDeleteBody,
          response: {
            200: productsBulkDeleteResponse,
            400: simpleError,
            401: simpleError,
            404: simpleError,
          },
        }
      )

      // ---------- USERS ----------
      .get(
        "/users",
        async ({ headers, set, query, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const limit = Math.min(
            100,
            Math.max(1, Number(query.limit ?? query.pageSize ?? 20))
          );
          const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
          });
          return {
            items: users.map((u) => ({
              id: u.id,
              email: u.email ?? "",
              name:
                [u.firstName, u.lastName].filter(Boolean).join(" ") ||
                u.email ||
                "",
              company: u.company,
              position: u.position,
              createdAt: u.createdAt.toISOString(),
            })),
          };
        },
        {
          query: t.Object({
            limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
            pageSize: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
          }),
          response: {
            200: usersListResponse,
            401: simpleError,
            404: simpleError,
          },
        }
      )
      .put(
        "/users/:id",
        async ({ headers, set, params, body, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const updated = await prisma.user.update({
            where: { id: params.id },
            data: {
              email: body.email ?? undefined,
              firstName: body.firstName ?? undefined,
              lastName: body.lastName ?? undefined,
              company: body.company ?? undefined,
              position: body.position ?? undefined,
            },
          });
          return {
            id: updated.id,
            email: updated.email ?? "",
            name:
              [updated.firstName, updated.lastName].filter(Boolean).join(" ") ||
              updated.email ||
              "",
            company: updated.company,
            position: updated.position,
            createdAt: updated.createdAt.toISOString(),
          };
        },
        {
          params: t.Object({ id: t.String() }),
          body: t.Object({
            email: t.Optional(t.String({ format: "email" })),
            firstName: t.Optional(t.Union([t.String(), t.Null()])),
            lastName: t.Optional(t.Union([t.String(), t.Null()])),
            company: t.Optional(t.Union([t.String(), t.Null()])),
            position: t.Optional(t.Union([t.String(), t.Null()])),
          }),
          response: { 200: userRowSchema, 401: simpleError, 404: simpleError },
        }
      )
      .post(
        "/users",
        async ({ headers, set, body, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const passwordHash = await bcrypt.hash(body.password, 10);
          const created = await prisma.user.create({
            data: {
              id: randomUUID(),
              email: body.email.toLowerCase(),
              passwordHash,
              firstName: body.firstName ?? null,
              lastName: body.lastName ?? null,
              company: body.company ?? null,
              position: body.position ?? null,
            },
          });
          return {
            id: created.id,
            email: created.email ?? "",
            name:
              [created.firstName, created.lastName].filter(Boolean).join(" ") ||
              created.email ||
              "",
            company: created.company,
            position: created.position,
            createdAt: created.createdAt.toISOString(),
          };
        },
        {
          body: t.Object({
            email: t.String({ format: "email" }),
            password: t.String({ minLength: 6 }),
            firstName: t.Optional(t.Union([t.String(), t.Null()])),
            lastName: t.Optional(t.Union([t.String(), t.Null()])),
            company: t.Optional(t.Union([t.String(), t.Null()])),
            position: t.Optional(t.Union([t.String(), t.Null()])),
          }),
          response: { 200: userRowSchema, 401: simpleError, 404: simpleError },
        }
      )
      .delete(
        "/users/:id",
        async ({ headers, set, params, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const u = await prisma.user.findUnique({ where: { id: params.id } });
          if (!u) {
            set.status = 404;
            return err("not_found", ip);
          }

          const tombstone = `${u.email}#deleted#${Date.now()}`;
          const passwordHash = await bcrypt.hash(randomUUID(), 10);
          const updated = await prisma.user.update({
            where: { id: params.id },
            data: {
              email: tombstone,
              passwordHash,
              firstName: null,
              lastName: null,
              company: null,
              position: null,
            },
          });
          return {
            id: updated.id,
            email: updated.email ?? "",
            name:
              [updated.firstName, updated.lastName].filter(Boolean).join(" ") ||
              updated.email ||
              "",
            company: updated.company,
            position: updated.position,
            createdAt: updated.createdAt.toISOString(),
          };
        },
        {
          params: t.Object({ id: t.String() }),
          response: { 200: userRowSchema, 401: simpleError, 404: simpleError },
        }
      )

      // ---------- PURCHASES ----------
      .post(
        "/purchases",
        async ({ headers, set, body, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const nowIso = new Date().toISOString();
          const currency = (body.currency ?? DEFAULT_CURRENCY).toString();
          const status = "pending";

          const ids = Array.from(
            new Set(
              (body.items ?? [])
                .map((i) => i.productId)
                .filter((x): x is string => !!x)
            )
          );
          const prods =
            ids.length === 0
              ? []
              : await prisma.product.findMany({
                  where: { id: { in: ids } },
                  include: {
                    translations: { where: { localeCode: DEFAULT_LOCALE } },
                  },
                });
          const prodTitle = new Map(
            prods.map((p) => [
              p.id,
              p.translations?.[0]?.title ?? p.title ?? "Ürün",
            ])
          );

          const normalizedItems = body.items.map((i) => ({
            id: randomUUID(),
            productId: i.productId ?? null,
            title:
              i.title ??
              (i.productId ? prodTitle.get(i.productId) ?? "Ürün" : "Ürün"),
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            currency,
            createdAt: nowIso,
          }));

          const totalAmount = normalizedItems.reduce(
            (acc, it) => acc + Number(it.unitPrice) * Number(it.quantity),
            0
          );

          const created = await prisma.purchase.create({
            data: {
              id: randomUUID(),
              userId: body.userId,
              orderNumber: `ORD-${Date.now().toString(36)}-${Math.random()
                .toString(36)
                .slice(2, 8)
                .toUpperCase()}`,
              status,
              totalAmount,
              currency,
              notes: body.notes ?? null,
              createdAt: new Date(nowIso),
              updatedAt: new Date(nowIso),
              items: { create: normalizedItems },
            },
            include: { items: true },
          });

          return {
            id: created.id,
            userId: created.userId,
            orderNumber: created.orderNumber,
            totalAmount: created.totalAmount,
            currency: created.currency,
            status: created.status,
            createdAt: created.createdAt.toISOString(),
            updatedAt: created.updatedAt.toISOString(),
            items: created.items.map((it) => ({
              id: it.id,
              productId: it.productId ?? null,
              title: it.title,
              quantity: it.quantity,
              unitPrice: it.unitPrice,
              currency: it.currency,
              createdAt:
                typeof it.createdAt === "string"
                  ? it.createdAt
                  : new Date(it.createdAt as any).toISOString(),
            })),
          };
        },
        {
          body: purchaseCreateBody,
          response: {
            200: purchaseRowSchema,
            401: simpleError,
            404: simpleError,
          },
        }
      )
      .get(
        "/purchases",
        async ({ headers, set, query, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const limit = Math.min(
            100,
            Math.max(1, Number(query.limit ?? query.pageSize ?? 20))
          );
          const list = await prisma.purchase.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            select: {
              id: true,
              userId: true,
              orderNumber: true,
              totalAmount: true,
              currency: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          });

          return {
            items: list.map((p) => ({
              id: p.id,
              userId: p.userId,
              orderNumber: p.orderNumber,
              totalAmount: p.totalAmount,
              currency: p.currency,
              status: p.status,
              createdAt: p.createdAt.toISOString(),
              updatedAt: p.updatedAt.toISOString(),
            })),
          };
        },
        {
          query: t.Object({
            limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
            pageSize: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
          }),
          response: {
            200: purchasesListResponse,
            401: simpleError,
            404: simpleError,
          },
        }
      )
      .get(
        "/purchases/:id",
        async ({ headers, set, params, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const purchase = await prisma.purchase.findUnique({
            where: { id: params.id },
            include: { items: true },
          });
          if (!purchase) {
            set.status = 404;
            return err("not_found", ip);
          }

          return {
            id: purchase.id,
            userId: purchase.userId,
            orderNumber: purchase.orderNumber,
            totalAmount: purchase.totalAmount,
            currency: purchase.currency,
            status: purchase.status,
            createdAt: purchase.createdAt.toISOString(),
            updatedAt: purchase.updatedAt.toISOString(),
            items: purchase.items.map((it) => ({
              id: it.id,
              productId: it.productId ?? null,
              title: it.title,
              quantity: it.quantity,
              unitPrice: it.unitPrice,
              currency: it.currency,
              createdAt:
                typeof it.createdAt === "string"
                  ? it.createdAt
                  : new Date(it.createdAt as any).toISOString(),
            })),
          };
        },
        {
          params: t.Object({ id: t.String() }),
          response: {
            200: purchaseRowSchema,
            401: simpleError,
            404: simpleError,
          },
        }
      )
      .post(
        "/categories",
        async ({ headers, set, body, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const created = await prisma.category.create({
            data: { id: randomUUID(), title: body.title.trim() },
            select: { id: true, title: true },
          });
          return created;
        },
        {
          body: t.Object({ title: t.String({ minLength: 1 }) }),
          response: {
            200: t.Object({ id: t.String(), title: t.String() }),
            401: simpleError,
            404: simpleError,
          },
        }
      )
      .patch(
        "/categories/:id",
        async ({ headers, set, params, body, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          const updated = await prisma.category.update({
            where: { id: params.id },
            data: { title: (body.title ?? "").trim() },
            select: { id: true, title: true },
          });
          return updated;
        },
        {
          params: t.Object({ id: t.String() }),
          body: t.Object({ title: t.String({ minLength: 1 }) }),
          response: {
            200: t.Object({ id: t.String(), title: t.String() }),
            401: simpleError,
            404: simpleError,
          },
        }
      )
      .delete(
        "/categories/:id",
        async ({ headers, set, params, ip: userIp }) => {
          const { allowed, ip } = await checkIPAccess(userIp);
          if (!allowed) {
            set.status = 404;
            return err("not_found", ip);
          }
          const session = await resolveSession(headers);
          if (!session) {
            set.status = 401;
            return err("unauthorized");
          }

          await prisma.category.update({
            where: { id: params.id },
            data: { deletedAt: new Date() },
          });
          return { ok: true as const };
        },
        {
          params: t.Object({ id: t.String() }),
          response: {
            200: t.Object({ ok: t.Literal(true) }),
            401: simpleError,
            404: simpleError,
          },
        }
      )
  );
}
