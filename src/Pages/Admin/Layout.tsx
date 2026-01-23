import { useEffect, useMemo } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router";
import { AdminApiClient } from "@/Utils/AdminApiClient";

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const api = useMemo(
    () =>
      new AdminApiClient("/api/admin", undefined, {
        token:
          typeof window !== "undefined"
            ? localStorage.getItem("admin_token") ?? undefined
            : undefined,
        onUnauthorized: () => {
          if (typeof window !== "undefined") {
            localStorage.removeItem("admin_token");
            navigate("/admin/login", { replace: true });
          }
        },
      }),
    [navigate]
  );

  useEffect(() => {
    const hasToken =
      typeof window !== "undefined" && !!localStorage.getItem("admin_token");
    if (!hasToken) navigate("/admin/login", { replace: true });
  }, [navigate]);

  const linkCls =
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium";
  const active = "bg-indigo-50 text-indigo-700 border border-indigo-100";
  const idle =
    "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-x-hidden">
      {/* SOL MENÜ */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 lg:w-72 z-40 bg-white/90 backdrop-blur border-r border-gray-200">
        <div className="w-full h-full overflow-y-auto p-4">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white grid place-items-center shadow">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                <path
                  d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="text-base font-semibold text-gray-900">
              Yönetim Paneli
            </div>
          </div>

          <nav className="mt-4 space-y-1">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `${linkCls} ${isActive ? active : idle}`
              }
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  d="M4 12l8-8 8 8M5 10v10h5v-6h4v6h5V10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `${linkCls} ${isActive ? active : idle}`
              }
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  d="M3 7l9-4 9 4-9 4-9-4zm0 4l9 4 9-4m-18 4v6l9 4 9-4v-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              Ürünler
            </NavLink>

            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `${linkCls} ${isActive ? active : idle}`
              }
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  d="M4 6h6v6H4zM14 6h6v6h-6zM4 16h6v6H4zM14 16h6v6h-6z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              Kategoriler
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `${linkCls} ${isActive ? active : idle}`
              }
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  d="M12 12a4 4 0 100-8 4 4 0 000 8zm7 9a7 7 0 10-14 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              Kullanıcılar
            </NavLink>
          </nav>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <button
              onClick={async () => {
                try {
                  await api.logout();
                } finally {
                  localStorage.removeItem("admin_token");
                  navigate("/admin/login", { replace: true });
                }
              }}
              className="w-full rounded-lg bg-gray-900 text-white px-4 py-2 text-sm"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </aside>

      {/* İÇERİK */}
      <main className="md:pl-64 lg:pl-72">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
