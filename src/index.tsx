// index.tsx
import { Elysia, file, redirect, status } from "elysia";
import { SystemRoutes } from "./Routes/System";
import { CategoryRoutes } from "./Routes/Category";
import { ProductRoutes } from "./Routes/Product";
import { AdminRoutes } from "./Routes/Admin";
import { AdminAccessService } from "./Utils/adminAccess";
import { swagger } from "@elysiajs/swagger";
import { staticPlugin } from "@elysiajs/static";
import rawIndex from "./index.html";
import chalk from "chalk";
import path from "path";

console.clear();

const app = new Elysia()

  .use(
    staticPlugin({
      assets: path.join(process.cwd(), "static"),
      prefix: "/static",
      maxAge: 3600,
    })
  )

  .get(
    "/favicon.ico",
    () =>
      new Response(
        file(path.join(process.cwd(), "src", "images", "favicon.ico"))
          .value as any,
        { headers: { "Content-Type": "image/x-icon" } }
      )
  )

  .use(SystemRoutes())
  .use(CategoryRoutes())
  .use(ProductRoutes())
  .use(AdminRoutes())

  .use(swagger({ path: "/swagger" }))

  .group("/admin", (admin) =>
    admin
      .onBeforeHandle(async ({ request }) => {
        const res = await AdminAccessService.check(request);
        const allowed = !!res?.allowed;

        if (allowed) return rawIndex;
        else return redirect("/404");
      })
      .get("/*", rawIndex)
  )

  .get("/urunler/:id", rawIndex)
  .get("/", rawIndex)
  .get("/:page", rawIndex)
  .onError(({ code, path }) => {
    if (path.startsWith("/api"))
      return status(404, {
        error: "NOT_FOUND",
      });

    switch (code) {
      case "NOT_FOUND":
        return redirect("/404");
    }
  });

app.listen(Number(Bun.env.PORT as string) || 3000, (sv) => {
  console.log(
    `${chalk.red`[Server]`} ${chalk.green`Started on:`} ${chalk.white(sv.url)}`
  );
});

process.on("uncaughtException", (err) => console.error(err));
process.on("unhandledRejection", (err) => console.error(err));
