import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  AdminApiClient,
  type Category,
  type ProductRow,
  type ProductUpdateBody,
  type ProductTranslationInput,
  type ProductTranslationsListResponse,
  type ProductImage,
} from "@/Utils/AdminApiClient";
import { ProductForm } from "./ProductForm";

export function AdminProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const api = useMemo(
    () =>
      new AdminApiClient("/api/admin", undefined, {
        token: localStorage.getItem("admin_token") ?? undefined,
        onUnauthorized: () => {
          localStorage.removeItem("admin_token");
          navigate("/admin/login", { replace: true });
        },
      }),
    [navigate]
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [initial, setInitial] = useState<Partial<ProductRow> | null>(null);
  const [initialTranslations, setInitialTranslations] = useState<
    ProductTranslationInput[] | null
  >(null);

  const [images, setImages] = useState<ProductImage[]>([]);
  const [localeOptions, setLocaleOptions] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // yeni: silme durumu
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setErr(null);
    try {
      const [cats, prod, trs, imgs] = await Promise.all([
        api.categories(),
        api.getProduct(id),
        api
          .getProductTranslations(id)
          .catch((): ProductTranslationsListResponse => ({ items: [] })),
        api.getProductImages(id).catch(() => ({ items: [] })),
      ]);
      setCategories(cats);
      setInitial(prod);
      setInitialTranslations(
        (trs.items ?? []).map((t) => ({
          localeCode: t.localeCode,
          title: t.title,
          price: t.price ?? "",
          description: t.description ?? "",
        }))
      );
      setImages(imgs.items ?? []);
      setLocaleOptions(
        Array.from(
          new Set((trs.items ?? []).map((t) => t.localeCode.toLowerCase()))
        ).sort()
      );
    } catch {
      setErr("Ürün veya çeviriler/görseller yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      navigate("/admin/login", { replace: true });
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (values: ProductUpdateBody) => {
    if (!id) return;
    await api.updateProduct(id, values);
    navigate("/admin/products", { replace: true });
  };

  const onClose = () => navigate("/admin/products");

  const onUpload = async (file: File, localeCode?: string) => {
    if (!id) return;
    await api.uploadProductImage(id, file, localeCode);
    const next = await api.getProductImages(id);
    setImages(next.items);
  };

  // yeni: sil
  const onDelete = async () => {
    if (!id) return;
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    setDeleting(true);
    try {
      await api.deleteProduct(id);
      navigate("/admin/products", { replace: true });
    } catch {
      alert("Ürün silinemedi.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-72 bg-white border rounded-2xl animate-pulse" />
      </div>
    );
  }
  if (err) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
        {err}
      </div>
    );
  }
  if (!initial) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Ürün Düzenle</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/admin/products")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
          >
            Listeye Dön
          </button>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-2 text-sm disabled:opacity-60"
          >
            {deleting ? "Siliniyor..." : "Sil"}
          </button>
        </div>
      </div>

      {/* Görsel yöneticisi */}
      <section className="bg-white border border-gray-100 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Görseller</h2>
        <ImageUploader onUpload={onUpload} locales={localeOptions} />
        <ImageGrid items={images} />
        <p className="mt-2 text-xs text-gray-500">
          Yalnızca yükleme desteklenir. Silme devre dışıdır.
        </p>
      </section>

      {/* Ürün alanları */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <ProductForm
          asPage
          mode="edit"
          initial={initial}
          initialTranslations={initialTranslations as ProductTranslationInput[]}
          categories={categories}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

/** ---- Görsel bileşenleri ---- */

function ImageUploader({
  onUpload,
  locales,
}: {
  onUpload: (file: File, locale?: string) => Promise<void>;
  locales: string[];
}) {
  const [file, setFile] = useState<File | null>(null);
  const [locale, setLocale] = useState<string>("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    await onUpload(file, locale || undefined);
    setFile(null);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Görsel
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(ev) => setFile(ev.target.files?.[0] ?? null)}
          className="block text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dil (opsiyonel)
        </label>
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white p-2 text-sm"
        >
          <option value="">Genel</option>
          {locales.map((lc) => (
            <option key={lc} value={lc}>
              {lc}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Yükle
      </button>
    </form>
  );
}

function ImageGrid({ items }: { items: ProductImage[] }) {
  if (items.length === 0) {
    return <div className="text-sm text-gray-500">Henüz görsel yok.</div>;
  }
  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((it) => (
        <figure
          key={it.id}
          className="border rounded-xl overflow-hidden bg-gray-50"
          title={it.localeCode ?? "genel"}
        >
          <img
            src={it.url}
            alt={it.id}
            className="w-full h-32 object-cover"
            loading="lazy"
          />
          <figcaption className="px-2 py-1 text-[11px] text-gray-600 flex justify-between">
            <span>{it.localeCode ?? "genel"}</span>
            <time>{new Date(it.createdAt).toLocaleDateString()}</time>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
