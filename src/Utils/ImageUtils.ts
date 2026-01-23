// src/Utils/ImageUtils.ts
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

/** ---------- Config ---------- */
export const STATIC_ROOT =
  process.env.STATIC_ROOT ?? path.normalize("E:\\ws\\ajans2\\frontend\\static");
export const STATIC_URL_PREFIX = (
  process.env.STATIC_URL_PREFIX ?? "/static"
).replace(/\/+$/g, "");

/** ---------- Utils ---------- */
const IMAGE_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".avif",
]);

export async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}
export function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_");
}
export function publicStaticUrl(rel: string) {
  return `${STATIC_URL_PREFIX}/${rel}`.replace(/\/+/g, "/");
}
export function normalizeLocale(input?: string | null): string | null {
  if (!input) return null;
  const lc = input.toLowerCase().trim();
  // izinli karakterleri sadeleştir
  const cleaned = lc.replace(/[^a-z0-9_-]/g, "");
  if (!cleaned) return null;
  return cleaned.slice(0, 8);
}
export function productLocaleDir(productId: string, locale?: string | null) {
  const lc = normalizeLocale(locale);
  return path.join(STATIC_ROOT, "products", productId, "_l", lc ?? "default");
}

export type ImageRow = {
  id: string;
  url: string;
  localeCode: string | null;
  createdAt: string;
};

async function scanDir(
  productId: string,
  abs: string,
  relLocale: string | null,
  out: ImageRow[]
) {
  try {
    const entries = await fs.readdir(abs, { withFileTypes: true });
    for (const f of entries) {
      if (!f.isFile()) continue;
      const ext = path.extname(f.name).toLowerCase();
      if (!IMAGE_EXT.has(ext)) continue;
      const full = path.join(abs, f.name);
      const st = await fs.stat(full);
      const rel = relLocale
        ? path.join("products", productId, "_l", relLocale, f.name)
        : path.join("products", productId, f.name); // legacy kök
      out.push({
        id: `fs:${relLocale ?? "legacy"}:${f.name}`,
        url: publicStaticUrl(rel.split(path.sep).join("/")),
        localeCode: relLocale,
        createdAt: (st.birthtime ?? st.mtime).toISOString(),
      });
    }
  } catch {
    // yoksa sessiz geç
  }
}

/** Tüm görseller veya tek bir dil için listeleme */
export async function listImages(
  productId: string,
  locale?: string | null
): Promise<ImageRow[]> {
  const out: ImageRow[] = [];

  if (locale) {
    const lc = normalizeLocale(locale);
    await scanDir(productId, productLocaleDir(productId, lc), lc, out);
  } else {
    // _l altındaki tüm diller
    try {
      const base = path.join(STATIC_ROOT, "products", productId, "_l");
      const entries = await fs.readdir(base, { withFileTypes: true });
      for (const d of entries) {
        if (!d.isDirectory()) continue;
        const relLocale = d.name === "default" ? "default" : d.name;
        await scanDir(productId, path.join(base, d.name), relLocale, out);
      }
    } catch {
      // _l yoksa önemli değil
    }
    // legacy kök
    await scanDir(
      productId,
      path.join(STATIC_ROOT, "products", productId),
      null,
      out
    );
  }

  out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  return out;
}

/** Yükleme ve kayıt */
export async function saveImage(
  productId: string,
  file: File,
  locale?: string | null
): Promise<ImageRow> {
  const lc = normalizeLocale(locale) ?? "default";
  const dir = productLocaleDir(productId, lc);
  await ensureDir(dir);

  const extGuess = path.extname(file.name || "").toLowerCase() || ".bin";
  const ext = extGuess.startsWith(".") ? extGuess : `.${extGuess}`;
  const fname = `${Date.now()}_${safeName(randomUUID())}${ext}`;
  const absPath = path.join(dir, fname);

  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(absPath, buf, { flag: "wx" });

  const rel = path
    .join("products", productId, "_l", lc, fname)
    .split(path.sep)
    .join("/");

  return {
    id: `fs:${lc}:${fname}`,
    url: publicStaticUrl(rel),
    localeCode: lc,
    createdAt: new Date().toISOString(),
  };
}

/** Birincil görsel çözümleme */
export async function resolvePrimaryImage(
  productId: string,
  locale?: string | null
): Promise<string | null> {
  // 1) locale
  const locFirst = await listImages(productId, locale ?? undefined);
  if (locFirst[0]?.url) return locFirst[0].url;
  // 2) default + tüm diller + legacy sıralaması
  const all = await listImages(productId);
  if (all[0]?.url) return all[0].url;
  return null;
}
