// src/Pages/Admin/Users.tsx  ← kullanıcı düzenleme eklendi
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  AdminApiClient,
  type UsersListResponse,
  type UserUpdate,
  type UserRow,
} from "@/Utils/AdminApiClient";

export function AdminUsers() {
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

  const [data, setData] = useState<UsersListResponse | null>(null);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [modal, setModal] = useState<null | { id: string; initial: UserRow }>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<UserUpdate>({});

  const load = () => {
    setLoading(true);
    setErr(null);
    api
      .users(limit)
      .then(setData)
      .catch(() => setErr("Kullanıcılar yüklenemedi."))
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

  const openEdit = (row: UserRow) => {
    setModal({ id: row.id, initial: row });
    // name'i basitçe ayır
    const [firstName, ...rest] = (row.name ?? "").split(" ");
    setForm({
      email: row.email,
      firstName: firstName || null,
      lastName: rest.join(" ") || null,
      company: row.company,
      position: row.position,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    setSaving(true);
    try {
      await api.updateUser(modal.id, form);
      setModal(null);
      setForm({});
      load();
    } catch {
      alert("Güncelleme başarısız.");
    } finally {
      setSaving(false);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Kullanıcılar</h1>
        <div className="flex items-center gap-2">
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
            onClick={load}
            className="rounded-lg bg-gray-900 text-white text-sm px-4 py-2"
          >
            Yenile
          </button>
        </div>
      </div>

      <section className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2 pr-4 font-medium">ID</th>
                <th className="py-2 pr-4 font-medium">Ad</th>
                <th className="py-2 pr-4 font-medium">E-posta</th>
                <th className="py-2 pr-4 font-medium">Şirket</th>
                <th className="py-2 pr-4 font-medium">Pozisyon</th>
                <th className="py-2 pr-4 font-medium">Kayıt Tarihi</th>
                <th className="py-2 pr-4 font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.items.map((u) => (
                <tr key={u.id} className="text-gray-900">
                  <td className="py-2 pr-4">{u.id}</td>
                  <td className="py-2 pr-4">{u.name}</td>
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">{u.company ?? "-"}</td>
                  <td className="py-2 pr-4">{u.position ?? "-"}</td>
                  <td className="py-2 pr-4">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 pr-4">
                    <button
                      onClick={() => openEdit(u)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs"
                    >
                      Düzenle
                    </button>
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
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

      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Kullanıcıyı Düzenle
              </h3>
              <button
                onClick={() => {
                  setModal(null);
                  setForm({});
                }}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad
                  </label>
                  <input
                    value={form.firstName ?? ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, firstName: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad
                  </label>
                  <input
                    value={form.lastName ?? ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, lastName: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  value={form.email ?? ""}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, email: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şirket
                  </label>
                  <input
                    value={form.company ?? ""}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        company: e.target.value || null,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pozisyon
                  </label>
                  <input
                    value={form.position ?? ""}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        position: e.target.value || null,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setModal(null);
                    setForm({});
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
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
