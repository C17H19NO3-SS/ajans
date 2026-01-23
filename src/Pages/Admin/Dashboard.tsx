// src/Pages/Admin/Dashboard.tsx  (içeriğe indirgenmiş, Layout üst yapıyı veriyor)
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AdminApiClient, type DashboardResponse } from "@/Utils/AdminApiClient";

export function AdminDashboard() {
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

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setErr(null);
    api
      .dashboardOverview()
      .then(setData)
      .catch(() => setErr("Veri yüklenemedi."))
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white border rounded-2xl p-4">
              <div className="h-full w-full bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="h-72 bg-white border rounded-2xl animate-pulse" />
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

  const { stats, latestProducts, latestUsers } = data;

  const StatCard = ({ label, value }: { label: string; value: number }) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <button
          onClick={load}
          className="rounded-lg bg-gray-900 text-white text-sm px-4 py-2"
        >
          Yenile
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Toplam Ürün" value={stats.totalProducts} />
        <StatCard label="Toplam Kullanıcı" value={stats.totalUsers} />
        <StatCard label="Toplam Sipariş" value={stats.totalOrders} />
        <StatCard label="Aktif Oturum" value={stats.activeSessions} />
      </div>

      <section className="bg-white border border-gray-100 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Son Ürünler
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2 pr-4 font-medium">ID</th>
                <th className="py-2 pr-4 font-medium">Başlık</th>
                <th className="py-2 pr-4 font-medium">Kategori</th>
                <th className="py-2 pr-4 font-medium">Güncellendi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {latestProducts.map((p) => (
                <tr key={p.id} className="text-gray-900">
                  <td className="py-2 pr-4">{p.id}</td>
                  <td className="py-2 pr-4">{p.title}</td>
                  <td className="py-2 pr-4">{p.category ?? "-"}</td>
                  <td className="py-2 pr-4">
                    {new Date(p.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {latestProducts.length === 0 && (
                <tr>
                  <td className="py-4 pr-4 text-gray-500" colSpan={4}>
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Son Kullanıcılar
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2 pr-4 font-medium">ID</th>
                <th className="py-2 pr-4 font-medium">Ad</th>
                <th className="py-2 pr-4 font-medium">E-posta</th>
                <th className="py-2 pr-4 font-medium">Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {latestUsers.map((u) => (
                <tr key={u.id} className="text-gray-900">
                  <td className="py-2 pr-4">{u.id}</td>
                  <td className="py-2 pr-4">{u.name}</td>
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {latestUsers.length === 0 && (
                <tr>
                  <td className="py-4 pr-4 text-gray-500" colSpan={4}>
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
