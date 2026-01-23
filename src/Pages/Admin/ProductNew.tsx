import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  AdminApiClient,
  type Category,
  type ProductCreateBody,
  type ProductUpdateBody,
} from "@/Utils/AdminApiClient";
import { ProductForm } from "./ProductForm";

export function AdminProductNew() {
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
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      navigate("/admin/login", { replace: true });
      return;
    }
    const load = async () => {
      setLoading(true);
      setErr(null);
      try {
        const cats = await api.categories();
        setCategories(cats);
      } catch {
        setErr("Kategoriler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [api, navigate]);

  // ÖNEMLİ: create sırasında id göndermiyoruz
  const toCreatePayload = (v: ProductUpdateBody): ProductCreateBody => ({
    title: v.title ?? "",
    price: v.price ?? null,
    categoryId: v.categoryId ?? null,
    status: v.status ?? "published",
    description: v.description ?? null,
    translations: v.translations ?? [],
  });

  const onSubmit = async (values: ProductUpdateBody) => {
    const payload = toCreatePayload(values);
    await api.createProduct(payload);
  };

  const onClose = () => navigate("/admin/products");

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Yeni Ürün</h1>
        <button
          onClick={() => navigate("/admin/products")}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
        >
          Listeye Dön
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <ProductForm
          asPage
          mode="create"
          categories={categories}
          onSubmit={async (v) => {
            await onSubmit(v);
            navigate("/admin/products", { replace: true });
          }}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
