// src/Pages/Admin/Login.tsx
import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { AdminApiClient, type AuthErrorResponse } from "@/Utils/AdminApiClient";

export const AdminLogin = () => {
  const navigate = useNavigate();

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

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onChange =
    (field: "identifier" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((s) => ({ ...s, [field]: e.target.value }));

  const errorText = (code?: string) => {
    switch (code) {
      case "invalid_credentials":
        return "Bilgiler hatalı.";
      case "forbidden":
        return "Bu kaynağa erişiminiz yok.";
      case "unauthorized":
        return "Oturum yetkisiz. Tekrar giriş yapın.";
      case "not_found":
        return "Kullanıcı bulunamadı.";
      default:
        return "Bir hata oluştu. Tekrar deneyin.";
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      // API: login(email, password) => token set edilir
      const res = await api.login(form.identifier, form.password);
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_token", res.token);
      }
      navigate("/admin", { replace: true }); // Hedef route'u projene göre değiştir (örn: /admin/dashboard)
    } catch (e: any) {
      const code: string | undefined = e?.response?.data?.error;
      setErr(errorText(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-gray-100 shadow-lg rounded-2xl p-6">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Yönetici Girişi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Lütfen bilgilerinizi girin
          </p>
        </div>

        {err && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
            {err}
          </div>
        )}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Kullanıcı adı veya e-posta
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              required
              value={form.identifier}
              onChange={onChange("identifier")}
              className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="ornek@site.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={onChange("password")}
              className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş yap"}
          </button>
        </form>
      </div>
    </div>
  );
};
