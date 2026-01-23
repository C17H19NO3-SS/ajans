import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AdminApiClient, type Category } from "@/Utils/AdminApiClient";

export function AdminCategories() {
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

  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [modal, setModal] = useState<
    | null
    | { mode: "create"; value: string }
    | { mode: "edit"; id: string; value: string }
  >(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setErr(null);
    api
      .categories()
      .then(setRows)
      .catch(() => setErr("Kategoriler yüklenemedi."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      navigate("/admin/login", { replace: true });
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = rows.filter((c) =>
    c.title.toLowerCase().includes(q.toLowerCase())
  );

  const openCreate = () => setModal({ mode: "create", value: "" });
  const openEdit = (row: Category) =>
    setModal({ mode: "edit", id: row.id, value: row.title });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    setSaving(true);
    try {
      if (modal.mode === "create") {
        const title = modal.value.trim();
        if (!title) return;
        await api.createCategory(title);
      } else {
        const title = modal.value.trim();
        if (!title) return;
        await api.updateCategory(modal.id, { title });
      }
      setModal(null);
      load();
    } catch {
      alert("İşlem başarısız.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    setDeletingId(id);
    try {
      await api.deleteCategory(id);
      load();
    } catch {
      alert("Silme başarısız.");
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Kategoriler</h1>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ara..."
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={load}
            className="rounded-lg bg-gray-900 text-white text-sm px-4 py-2"
          >
            Yenile
          </button>
          <button
            onClick={openCreate}
            className="rounded-lg bg-indigo-600 text-white text-sm px-4 py-2 hover:bg-indigo-700"
          >
            + Yeni Kategori
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
                <th className="py-2 pr-4 font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((c) => (
                <tr key={c.id} className="text-gray-900">
                  <td className="py-2 pr-4">{c.id}</td>
                  <td className="py-2 pr-4">{c.title}</td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => remove(c.id)}
                        disabled={deletingId === c.id}
                        className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-1.5 text-xs disabled:opacity-60"
                      >
                        {deletingId === c.id ? "Siliniyor..." : "Sil"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="py-4 pr-4 text-gray-500" colSpan={3}>
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {modal.mode === "create"
                  ? "Yeni Kategori"
                  : "Kategoriyi Düzenle"}
              </h3>
              <button
                onClick={() => setModal(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlık
                </label>
                <input
                  value={modal.value}
                  onChange={(e) =>
                    setModal(
                      modal.mode === "create"
                        ? { mode: "create", value: e.target.value }
                        : { mode: "edit", id: modal.id, value: e.target.value }
                    )
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Örn: Prodüksiyon"
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm disabled:opacity-60"
                >
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
