// src/Routes/User.ts
import { Elysia, t } from "elysia";
import type { Static } from "elysia";
import { randomBytes, createHash, createHmac } from "crypto";
import bcrypt from "bcryptjs";
import type { SQL } from "bun";
import { siteConfig } from "@/data/site";
import type {
  PurchaseItemRow,
  PurchaseRow,
  TokenRow,
  UserRow,
} from "@/Types/User";

// ---------- helpers ----------
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const BCRYPT_ROUNDS = 12;
const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
const sanitize = (v?: string | null) => {
  const s = v?.trim();
  return s && s.length > 0 ? s : null;
};
const normalizeEmail = (v: string) => v.trim().toLowerCase();
const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
const toSqlDateTime = (d: Date | number) => {
  const x = typeof d === "number" ? new Date(d) : d;
  return `${x.getUTCFullYear()}-${pad(x.getUTCMonth() + 1)}-${pad(
    x.getUTCDate()
  )} ${pad(x.getUTCHours())}:${pad(x.getUTCMinutes())}:${pad(
    x.getUTCSeconds()
  )}`;
};
// API çıkışı için ISO 8601
const toIso = (v: unknown): string => {
  if (!v) return "";
  if (v instanceof Date) return v.toISOString();
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s))
    return s.replace(" ", "T") + "Z";
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s;
  const d = new Date(s);
  return Number.isNaN(d.valueOf()) ? s : d.toISOString();
};

async function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}
async function verifyPassword(password: string, stored: string) {
  if (!stored) return { valid: false } as const;

  if (stored.startsWith("$2")) {
    try {
      const valid = await bcrypt.compare(password, stored);
      return { valid } as const;
    } catch {
      return { valid: false } as const;
    }
  }

  const [legacySalt, legacyHash] = stored.split("$");
  if (!legacySalt || !legacyHash) return { valid: false } as const;

  const calc = createHmac("sha256", legacySalt).update(password).digest("hex");
  if (calc !== legacyHash) return { valid: false } as const;

  const upgraded = await bcrypt.hash(password, BCRYPT_ROUNDS);
  return { valid: true, upgraded } as const;
}

async function issueToken(mysqlUsers: SQL, userId: string) {
  const token = randomBytes(24).toString("hex");
  const tokenHash = hashToken(token);
  const now = toSqlDateTime(new Date());
  const expiresAt = toSqlDateTime(Date.now() + TOKEN_TTL_MS);

  await mysqlUsers`
    INSERT INTO user_tokens (tokenHash, userId, createdAt, lastUsedAt, expiresAt)
    VALUES (${tokenHash}, ${userId}, ${now}, ${now}, ${expiresAt})
    ON DUPLICATE KEY UPDATE lastUsedAt=VALUES(lastUsedAt), expiresAt=VALUES(expiresAt)
  `;
  return { token, expiresAt };
}

const bearer = (headers: Record<string, string | undefined>) => {
  const raw = headers["authorization"] ?? headers["Authorization"];
  if (!raw) return null;
  const [scheme, value] = raw.split(" ");
  return scheme?.toLowerCase() === "bearer" && value ? value.trim() : null;
};

// ---------- schemas ----------
const userSchema = t.Object(
  {
    id: t.String(),
    email: t.String({ format: "email", default: "" }),
    username: t.Union([t.String(), t.Null()]),
    firstName: t.Union([t.String(), t.Null()]),
    lastName: t.Union([t.String(), t.Null()]),
    company: t.Union([t.String(), t.Null()]),
    phone: t.Union([t.String(), t.Null()]),
    position: t.Union([t.String(), t.Null()]),
    createdAt: t.String({ format: "date-time", default: "" }),
  },
  { additionalProperties: false }
);

const authSuccess = t.Object(
  {
    ok: t.Literal(true),
    token: t.String(),
    user: userSchema,
    expiresAt: t.String(), // "YYYY-MM-DD HH:MM:SS"
  },
  { additionalProperties: false }
);

const authErrorSchema = t.Object(
  {
    ok: t.Literal(false),
    error: t.String(),
  },
  { additionalProperties: false }
);

const profileUpdateSchema = t.Object({
  firstName: t.Optional(t.Union([t.String(), t.Null()])),
  lastName: t.Optional(t.Union([t.String(), t.Null()])),
  username: t.Optional(t.Union([t.String(), t.Null()])),
  company: t.Optional(t.Union([t.String(), t.Null()])),
  phone: t.Optional(t.Union([t.String(), t.Null()])),
  position: t.Optional(t.Union([t.String(), t.Null()])),
});

const orderItemSchema = t.Object({
  name: t.String(),
  quantity: t.Number(),
  price: t.Number(),
});

const orderSchema = t.Object({
  id: t.String(),
  orderNumber: t.String(),
  status: t.String(),
  totalAmount: t.Number(),
  currency: t.String(),
  createdAt: t.String(),
  items: t.Array(orderItemSchema),
});

const ordersResponseSchema = t.Object({ items: t.Array(orderSchema) });

// Login body şemaları
const loginEmailBody = t.Object(
  {
    email: t.String({ format: "email", default: "" }),
    password: t.String({ minLength: 6 }),
  },
  { additionalProperties: false }
);
const loginUsernameBody = t.Object(
  {
    username: t.String({ minLength: 3, default: "" }),
    password: t.String({ minLength: 6 }),
  },
  { additionalProperties: false }
);
const loginIdentifierBody = t.Object(
  {
    identifier: t.String({ minLength: 3, default: "" }),
    password: t.String({ minLength: 6 }),
  },
  { additionalProperties: false }
);
const loginBody = t.Union([
  loginEmailBody,
  loginUsernameBody,
  loginIdentifierBody,
]);

// Register body şeması
const registerBody = t.Object({
  email: t.String({ format: "email" }),
  username: t.Optional(t.String({ minLength: 3 })),
  firstName: t.Optional(t.String()),
  lastName: t.Optional(t.String()),
  company: t.Optional(t.String()),
  phone: t.Optional(t.String()),
  position: t.Optional(t.String()),
  password: t.String({ minLength: 6 }),
});

// ---------- types ----------
type PublicUser = Static<typeof userSchema>;
type OrdersOK = Static<typeof ordersResponseSchema>;
type AuthErr = Static<typeof authErrorSchema>;
type OrderDTO = Static<typeof orderSchema>;
type LoginBody = Static<typeof loginBody>;
type RegisterBody = Static<typeof registerBody>;

// ---------- routes ----------
export function UserRoutes(mysqlUsers: SQL, mysqlPurchases: SQL) {
  return (
    new Elysia({ prefix: "/api" })
      // Register
      .post(
        "/auth/register",
        async ({ body, set }: { body: RegisterBody; set: any }) => {
          const email = normalizeEmail(body.email);
          const username = body.username ? sanitize(body.username) : null;
          const firstName = body.firstName ? sanitize(body.firstName) : null;
          const lastName = body.lastName ? sanitize(body.lastName) : null;
          const company = body.company ? sanitize(body.company) : null;
          const phone = body.phone ? sanitize(body.phone) : null;
          const position = body.position ? sanitize(body.position) : null;

          const [exists] = (await mysqlUsers`
          SELECT id FROM users WHERE lower(email)=lower(${email}) OR lower(username)=lower(${username})
          LIMIT 1
        `) as Array<{ id: string }>;
          if (exists) {
            set.status = 409;
            return { ok: false as const, error: "user_exists" };
          }

          const id = randomBytes(8).toString("hex");
          const createdAtSql = toSqlDateTime(new Date());
          const passwordHash = await hashPassword((body as any).password);

          await mysqlUsers`
          INSERT INTO users
            (id,email,username,firstName,lastName,company,phone,position,passwordHash,createdAt)
          VALUES
            (${id},${email},${username},${firstName},${lastName},${company},${phone},${position},${passwordHash},${createdAtSql})
        `;

          await mysqlUsers`INSERT IGNORE INTO user_settings (userId, locale) VALUES (${id}, 'tr')`;

          const { token, expiresAt } = await issueToken(mysqlUsers, id);
          const user: PublicUser = {
            id,
            email,
            username,
            firstName,
            lastName,
            company,
            phone,
            position,
            createdAt: toIso(createdAtSql),
          };
          set.status = 201;
          return { ok: true as const, token, user, expiresAt };
        },
        {
          body: registerBody,
          response: {
            201: authSuccess,
            409: authErrorSchema,
          },
        }
      )

      // Login — email | username | identifier
      .post(
        "/auth/login",
        async ({ body, set }: { body: LoginBody; set: any }) => {
          const b = body as any;

          const hasEmail =
            typeof b.email === "string" && b.email.trim().length > 0;
          const hasUsername =
            typeof b.username === "string" && b.username.trim().length > 0;
          const hasIdentifier =
            typeof b.identifier === "string" && b.identifier.trim().length > 0;

          if (!hasEmail && !hasUsername && !hasIdentifier) {
            set.status = 422;
            return { ok: false as const, error: "identifier_required" };
          }

          const password = String(b.password ?? "");
          let row: (UserRow & { passwordHash: string }) | undefined;

          if (hasEmail) {
            const email = normalizeEmail(b.email);
            const [r] = (await mysqlUsers`
            SELECT id,email,username,firstName,lastName,company,phone,position,passwordHash,createdAt
            FROM users WHERE lower(email)=lower(${email}) LIMIT 1
          `) as Array<UserRow & { passwordHash: string }>;
            row = r;
          } else if (hasUsername) {
            const username = String(b.username).trim().toLowerCase();
            const [r] = (await mysqlUsers`
            SELECT id,email,username,firstName,lastName,company,phone,position,passwordHash,createdAt
            FROM users WHERE lower(username)=lower(${username}) LIMIT 1
          `) as Array<UserRow & { passwordHash: string }>;
            row = r;
          } else {
            const idRaw = String(b.identifier).trim();
            const looksEmail = idRaw.includes("@");
            if (looksEmail) {
              const email = normalizeEmail(idRaw);
              const [r] = (await mysqlUsers`
              SELECT id,email,username,firstName,lastName,company,phone,position,passwordHash,createdAt
              FROM users WHERE lower(email)=lower(${email}) LIMIT 1
            `) as Array<UserRow & { passwordHash: string }>;
              row = r;
            } else {
              const username = idRaw.toLowerCase();
              const [r] = (await mysqlUsers`
              SELECT id,email,username,firstName,lastName,company,phone,position,passwordHash,createdAt
              FROM users WHERE lower(username)=lower(${username}) LIMIT 1
            `) as Array<UserRow & { passwordHash: string }>;
              row = r;
            }
          }

          if (
            !row ||
            !row.passwordHash ||
            !(await verifyPassword(password, row.passwordHash))
          ) {
            set.status = 401;
            return { ok: false as const, error: "invalid_credentials" };
          }

          const { token, expiresAt } = await issueToken(mysqlUsers, row.id);
          const user: PublicUser = {
            id: row.id,
            email: row.email,
            username: row.username,
            firstName: row.firstName,
            lastName: row.lastName,
            company: row.company,
            phone: row.phone,
            position: row.position,
            createdAt: toIso(row.createdAt),
          };
          return { ok: true as const, token, user, expiresAt };
        },
        {
          body: loginBody,
          response: {
            200: authSuccess,
            401: authErrorSchema,
            422: authErrorSchema,
          },
        }
      )

      // Me
      .get(
        "/auth/me",
        async ({
          headers,
          set,
        }: {
          headers: Record<string, string | undefined>;
          set: any;
        }) => {
          const token = bearer(headers as any);
          if (!token) {
            set.status = 401;
            return { ok: false as const, error: "unauthorized" };
          }

          const tokenHash = hashToken(token);
          const [tokenRow] = (await mysqlUsers`
          SELECT userId,expiresAt FROM user_tokens WHERE tokenHash=${tokenHash} LIMIT 1
        `) as Array<TokenRow>;

          if (!tokenRow) {
            set.status = 401;
            return { ok: false as const, error: "unauthorized" };
          }

          const now = toSqlDateTime(new Date());
          const [userRow] = (await mysqlUsers`
          SELECT id,email,username,firstName,lastName,company,phone,position,createdAt
          FROM users WHERE id=${tokenRow.userId} LIMIT 1
        `) as Array<UserRow>;

          if (!userRow) {
            await mysqlUsers`DELETE FROM user_tokens WHERE tokenHash=${tokenHash}`;
            set.status = 401;
            return { ok: false as const, error: "unauthorized" };
          }

          await mysqlUsers`UPDATE user_tokens SET lastUsedAt=${now} WHERE tokenHash=${tokenHash}`;

          return {
            user: {
              id: userRow.id,
              email: userRow.email,
              username: userRow.username,
              firstName: userRow.firstName,
              lastName: userRow.lastName,
              company: userRow.company,
              phone: userRow.phone,
              position: userRow.position,
              createdAt: toIso(userRow.createdAt),
            },
          };
        },
        {
          response: {
            200: t.Object({ user: userSchema }),
            401: authErrorSchema,
          },
        }
      )

      // Logout
      .post(
        "/auth/logout",
        async ({
          headers,
        }: {
          headers: Record<string, string | undefined>;
        }) => {
          const token = bearer(headers as any);
          if (token)
            await mysqlUsers`DELETE FROM user_tokens WHERE tokenHash=${hashToken(
              token
            )}`;
          return { ok: true as const };
        },
        { response: t.Object({ ok: t.Literal(true) }) }
      )

      // Profile update
      .patch(
        "/user/profile",
        async ({
          headers,
          body,
          set,
        }: {
          headers: Record<string, string | undefined>;
          body: Static<typeof profileUpdateSchema>;
          set: any;
        }) => {
          const token = bearer(headers as any);
          if (!token) {
            set.status = 401;
            return { ok: false as const, error: "unauthorized" };
          }
          const tokenHash = hashToken(token);
          const [session] = (await mysqlUsers`
          SELECT userId FROM user_tokens WHERE tokenHash=${tokenHash} LIMIT 1
        `) as Array<{ userId: string }>;
          if (!session) {
            set.status = 401;
            return { ok: false as const, error: "unauthorized" };
          }

          const updates: Record<string, string | null> = {
            firstName: body.firstName ?? null,
            lastName: body.lastName ?? null,
            username: body.username ?? null,
            company: body.company ?? null,
            phone: body.phone ?? null,
            position: body.position ?? null,
          };

          await mysqlUsers`
          UPDATE users SET
            firstName=${updates.firstName},
            lastName=${updates.lastName},
            username=${updates.username},
            company=${updates.company},
            phone=${updates.phone},
            position=${updates.position}
          WHERE id=${session.userId}
        `;

          const rows = (await mysqlUsers`
          SELECT id,email,username,firstName,lastName,company,phone,position,createdAt
          FROM users WHERE id=${session.userId} LIMIT 1
        `) as Array<UserRow>;
          const userRow = rows[0];
          if (!userRow) {
            set.status = 401;
            return { ok: false as const, error: "unauthorized" };
          }

          return {
            user: {
              id: userRow.id,
              email: userRow.email,
              username: userRow.username,
              firstName: userRow.firstName,
              lastName: userRow.lastName,
              company: userRow.company,
              phone: userRow.phone,
              position: userRow.position,
              createdAt: toIso(userRow.createdAt),
            },
          };
        },
        {
          body: profileUpdateSchema,
          response: {
            200: t.Object({ user: userSchema }),
            401: authErrorSchema,
          },
        }
      )

      // Orders
      .get(
        "/user/orders",
        async ({
          headers,
          set,
        }: {
          headers: Record<string, string | undefined>;
          set: any;
        }) => {
          const token = bearer(headers as any);
          if (!token) {
            set.status = 401;
            return { ok: false as const, error: "unauthorized" };
          }

          const tokenHash = hashToken(token);
          const [session] = (await mysqlUsers`
          SELECT userId FROM user_tokens WHERE tokenHash=${tokenHash} LIMIT 1
        `) as Array<{ userId: string }>;
          if (!session) {
            set.status = 401;
            return { ok: false as const, error: "unauthorized" };
          }

          const orders = (await mysqlPurchases`
          SELECT id,userId,orderNumber,status,totalAmount,currency,createdAt,updatedAt
          FROM purchases
          WHERE userId = ${session.userId}
          ORDER BY createdAt DESC, updatedAt DESC
        `) as PurchaseRow[];

          const items = (await mysqlPurchases`
          SELECT i.id,i.purchaseId,i.productId,i.title,i.quantity,i.unitPrice,i.currency
          FROM purchase_items i
          INNER JOIN purchases p ON p.id = i.purchaseId
          WHERE p.userId = ${session.userId}
          ORDER BY p.createdAt DESC, i.sortOrder ASC, i.createdAt ASC
        `) as PurchaseItemRow[];

          const map = new Map<
            string,
            Array<{ name: string; quantity: number; price: number }>
          >();
          for (const it of items) {
            const arr = map.get(it.purchaseId) ?? [];
            arr.push({
              name: String(it.title ?? ""),
              quantity: Number(it.quantity ?? 0),
              price: Number(it.unitPrice ?? 0),
            });
            if (!map.has(it.purchaseId)) map.set(it.purchaseId, arr);
          }

          const STATUS_LABELS: Record<string, string> = {
            completed: "Tamamlandı",
            processing: "Hazırlanıyor",
            pending: "Beklemede",
            cancelled: "İptal Edildi",
            refunded: "İade Edildi",
          };

          const normalized: OrderDTO[] = orders.map((o) => {
            const lineItems = map.get(o.id) ?? [];
            const calc = lineItems.reduce(
              (acc, it) => acc + Number(it.quantity) * Number(it.price),
              0
            );
            const totalAmount =
              Number(o.totalAmount) > 0 ? Number(o.totalAmount) : calc;
            const key = String(o.status ?? "").toLowerCase();
            const status =
              STATUS_LABELS[key] ??
              (o.status ? String(o.status) : "Bilinmiyor");
            return {
              id: String(o.id),
              orderNumber: String(o.orderNumber),
              status,
              totalAmount,
              currency: String(o.currency),
              createdAt: toIso(o.createdAt),
              items: lineItems,
            };
          });

          if (normalized.length > 0) return { items: normalized };

          const products = siteConfig.products ?? [];
          const fallback = products.length
            ? products.slice(0, 3).map((p: any, idx: number) => {
                const subtotal = Number(p?.priceAmount) || 8900 + idx * 4200;
                const createdAt = toSqlDateTime(
                  new Date(Date.now() - idx * 1000 * 60 * 60 * 24 * 10)
                );
                const orderNumber = `TD-${session.userId
                  .slice(0, 4)
                  .toUpperCase()}-${String(3000 + idx)}`;
                return {
                  id: `${session.userId}-seed-${idx}`,
                  orderNumber,
                  status: "Tamamlandı",
                  totalAmount: subtotal,
                  currency: "TRY",
                  createdAt: toIso(createdAt),
                  items: [
                    {
                      name: String(p?.title ?? "Dijital Hizmet Paketi"),
                      quantity: 1,
                      price: subtotal,
                    },
                  ],
                };
              })
            : [];

          return { items: fallback } as OrdersOK;
        },
        {
          response: {
            200: ordersResponseSchema,
            401: authErrorSchema,
          },
        }
      )
  );
}
