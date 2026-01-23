import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  AdminApiClient,
  type ProductsListResponse,
  type Category,
} from "@/Utils/AdminApiClient";

export function AdminProducts() {
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

  const [data, setData] = useState<ProductsListResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setErr(null);
    Promise.all([api.products(limit), api.categories()])
      .then(([list, cats]) => {
        setData(list);
        setCategories(cats);
      })
      .catch(() => setErr("Ürünler yüklenemedi."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      navigate("/admin/login", { replace: true });
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const filtered =
    data?.items.filter((p) => {
      if (!q) return true;
      const key = `${p.title} ${p.category ?? ""} ${p.id}`.toLowerCase();
      return key.includes(q.toLowerCase());
    }) ?? [];

  const editRoute = (id: string) => navigate(`/admin/products/${id}`);

  const toggleStatus = async (row: {
    id: string;
    status: "published" | "archived";
  }) => {
    const next = row.status === "published" ? "archived" : "published";
    setBusyId(row.id);
    try {
      await api.setProductStatus(row.id, next);
      load();
    } catch {
      alert("Durum güncellenemedi.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    setDeletingId(id);
    try {
      await api.deleteProduct(id);
      load();
    } catch {
      alert("Ürün silinemedi.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
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
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Ürünler</h1>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ara..."
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} satır
              </option>
            ))}
          </select>
          <button
            onClick={() => load()}
            className="rounded-lg bg-gray-900 text-white text-sm px-4 py-2"
          >
            Yenile
          </button>
          <button
            onClick={() => navigate("/admin/products/new")}
            className="rounded-lg bg-indigo-600 text-white text-sm px-4 py-2 hover:bg-indigo-700"
          >
            + Yeni Ürün
          </button>
        </div>
      </div>

      <section className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2 pr-4 font-medium">ID</th>
                <th className="py-2 pr-4 font-medium">Başlık</th>
                <th className="py-2 pr-4 font-medium">Kategori</th>
                <th className="py-2 pr-4 font-medium">Durum</th>
                <th className="py-2 pr-4 font-medium">Fiyat</th>
                <th className="py-2 pr-4 font-medium">Güncellendi</th>
                <th className="py-2 pr-4 font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p) => (
                <tr key={p.id} className="text-gray-900">
                  <td className="py-2 pr-4">{p.id}</td>
                  <td className="py-2 pr-4">{p.title}</td>
                  <td className="py-2 pr-4">{p.category ?? "-"}</td>
                  <td className="py-2 pr-4">
                    <button
                      onClick={() => toggleStatus(p)}
                      disabled={busyId === p.id}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs border ${
                        p.status === "published"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                      title="Durumu değiştir"
                    >
                      {busyId === p.id ? "…" : p.status}
                    </button>
                  </td>
                  <td className="py-2 pr-4">{p.price ?? "-"}</td>
                  <td className="py-2 pr-4">
                    {new Date(p.updatedAt).toLocaleString()}
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => editRoute(p.id)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        disabled={deletingId === p.id}
                        className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-1.5 text-xs disabled:opacity-60"
                      >
                        {deletingId === p.id ? "Siliniyor..." : "Sil"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="py-4 pr-4 text-gray-500" colSpan={7}>
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
