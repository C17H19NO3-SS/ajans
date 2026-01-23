// src/Routes/Category.ts – Prisma implementation
import { Elysia, t } from "elysia";
import type { Prisma } from "@prisma/client";
import type { TSchema } from "@sinclair/typebox";
import prisma from "@/lib/prisma";

const categorySchema = t.Object({
  id: t.String({ pattern: "^[a-z0-9_-]+$" }),
  title: t.String(),
  description: t.Optional(t.Union([t.String(), t.Null()])),
  icon: t.Optional(t.Union([t.String(), t.Null()])),
  created_at: t.Optional(t.String()),
  updated_at: t.Optional(t.String()),
});

const paginated = <T extends TSchema>(item: T) =>
  t.Object({
    items: t.Array(item),
    total: t.Number(),
    page: t.Number(),
    pageSize: t.Number(),
  });

// DB satırı: tarih alanları Date dönebilir
const toIso = (v?: string | Date | null) =>
  v ? (v instanceof Date ? v.toISOString() : v) : undefined;

const mapRow = (r: {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
}) => ({
  id: r.id,
  title: r.title,
  description: r.description,
  icon: r.icon,
  created_at: toIso(r.createdAt),
  updated_at: toIso(r.updatedAt),
});

export function CategoryRoutes() {
  return new Elysia({ prefix: "/api" })
    .get(
      "/categories",
      async ({ query }) => {
        const page = Math.max(1, Number(query.page ?? 1));
        const pageSize = Math.min(
          100,
          Math.max(1, Number(query.pageSize ?? 20))
        );
        const offset = (page - 1) * pageSize;

        const baseWhere = { deletedAt: null } as Prisma.CategoryWhereInput;

        const [total, rows] = await Promise.all([
          prisma.category.count({ where: baseWhere }),
          prisma.category.findMany({
            where: baseWhere,
            orderBy: { title: "asc" },
            skip: offset,
            take: pageSize,
          }),
        ]);

        const items = rows.map((row) =>
          mapRow({
            id: row.id,
            title: row.title,
            description: row.description,
            icon: row.icon,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
          })
        );

        return { items, total, page, pageSize };
      },
      {
        query: t.Object({
          page: t.Optional(t.Number({ minimum: 1 })),
          pageSize: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
        }),
        response: paginated(categorySchema),
      }
    )
    .get(
      "/categories/:id",
      async ({ params, set }) => {
        const row = await prisma.category.findUnique({
          where: { id: params.id },
        });

        if (!row || (row as any).deletedAt) {
          set.status = 404;
          return null;
        }
        return mapRow({
          id: row.id,
          title: row.title,
          description: row.description,
          icon: row.icon,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        });
      },
      {
        params: t.Object({ id: t.String() }),
        response: t.Union([categorySchema, t.Null()]),
      }
    );
}
