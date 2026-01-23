// src/Routes/System.ts
import { Elysia, t } from "elysia";

// Sistem
export function SystemRoutes() {
  return new Elysia({ prefix: "/api" })
    .get(
      "/system/health",
      () => ({ status: "ok" as const, time: new Date().toISOString() }),
      { response: t.Object({ status: t.Literal("ok"), time: t.String() }) }
    )
    .get(
      "/system/info",
      () => ({
        version: process.env.APP_VERSION ?? "dev",
        uptimeSec: Math.floor(process.uptime()),
        env: process.env.NODE_ENV ?? "development",
      }),
      {
        response: t.Object({
          version: t.Optional(t.String()),
          uptimeSec: t.Optional(t.Number()),
          env: t.Optional(t.String()),
        }),
      }
    );
}
