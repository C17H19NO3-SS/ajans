import { useEffect, useMemo, useState } from "react";
import {
  type Category,
  type ProductRow,
  type ProductUpdateBody,
  type ProductTranslationInput,
} from "@/Utils/AdminApiClient";

type Props = {
  asPage?: boolean;
  mode: "create" | "edit";
  initial?: Partial<ProductRow>;
  initialTranslations?: ProductTranslationInput[];
  categories: Category[];
  onSubmit: (values: ProductUpdateBody) => Promise<void> | void;
  onClose: () => void;
};

type FormState = {
  title: string;
  price: string;
  categoryId: string;
  status: "published" | "archived";
  description: string;
  translations: ProductTranslationInput[];
};

export function ProductForm({
  asPage,
  mode,
  initial,
  initialTranslations,
  categories,
  onSubmit,
  onClose,
}: Props) {
  const [state, setState] = useState<FormState>(() => ({
    title: initial?.title ?? "",
    price: (initial as any)?.price ?? "",
    categoryId: (initial as any)?.categoryId ?? "",
    status: (initial?.status as "published" | "archived") ?? "published",
    description: (initial as any)?.description ?? "",
    translations: (initialTranslations ?? []).map((t) => ({
      localeCode: t.localeCode,
      title: t.title ?? "",
      price: t.price ?? "",
      description: t.description ?? "",
    })),
  }));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // initial değişirse formu senkronla
    setState((s) => ({
      ...s,
      title: initial?.title ?? "",
      price: (initial as any)?.price ?? "",
      categoryId: (initial as any)?.categoryId ?? "",
      status: (initial?.status as "published" | "archived") ?? "published",
      description: (initial as any)?.description ?? "",
      translations: (initialTranslations ?? []).map((t) => ({
        localeCode: t.localeCode,
        title: t.title ?? "",
        price: t.price ?? "",
        description: t.description ?? "",
      })),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial?.title]);

  const canSubmit = useMemo(() => state.title.trim().length > 0, [state.title]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      const payload: ProductUpdateBody = {
        title: state.title.trim(),
        price: state.price.trim() ? state.price.trim() : null,
        categoryId: state.categoryId || null,
        status: state.status,
        description: state.description.trim() ? state.description.trim() : null,
        translations:
          state.translations.length > 0
            ? state.translations.map((t) => ({
                localeCode: t.localeCode.trim(),
                title: t.title?.trim() || null,
                price: t.price?.trim() ? t.price!.trim() : null,
                description: t.description?.trim() || null,
              }))
            : [],
      };
      await onSubmit(payload);
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setState((s) => ({ ...s, [key]: val }));

  const upsertTranslation = (
    idx: number,
    patch: Partial<ProductTranslationInput>
  ) =>
    setState((s) => {
      const next = [...s.translations];
      next[idx] = { ...next[idx], ...patch };
      return { ...s, translations: next };
    });

  const addTranslation = () =>
    setState((s) => ({
      ...s,
      translations: [
        ...s.translations,
        { localeCode: "", title: "", price: "", description: "" },
      ],
    }));

  const removeTranslation = (idx: number) =>
    setState((s) => ({
      ...s,
      translations: s.translations.filter((_, i) => i !== idx),
    }));

  return (
    <form onSubmit={submit} className={asPage ? "space-y-6" : "p-0"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Başlık <span className="text-red-500">*</span>
          </label>
          <input
            value={state.title}
            onChange={(e) => set("title", e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Örn: Drone Çekimi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fiyat
          </label>
          <input
            value={state.price}
            onChange={(e) => set("price", e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Örn: 6999₺"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori
          </label>
          <select
            value={state.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Seçiniz</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Durum
          </label>
          <select
            value={state.status}
            onChange={(e) =>
              set("status", e.target.value as "published" | "archived")
            }
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </div>

        {/* AÇIKLAMA — textarea */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Açıklama
          </label>
          <textarea
            value={state.description}
            onChange={(e) => set("description", e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ürünün kısa açıklaması..."
          />
        </div>
      </div>

      {/* ÇEVİRİLER */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Çeviriler (opsiyonel)
          </h3>
          <button
            type="button"
            onClick={addTranslation}
            className="rounded-lg bg-gray-900 text-white px-3 py-1.5 text-xs"
          >
            + Çeviri Ekle
          </button>
        </div>

        {state.translations.length === 0 && (
          <p className="text-xs text-gray-500">
            Henüz çeviri eklenmedi. “+ Çeviri Ekle” ile başlayın.
          </p>
        )}

        <div className="space-y-4">
          {state.translations.map((t, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-200 p-3 grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dil Kodu
                </label>
                <input
                  value={t.localeCode}
                  onChange={(e) =>
                    upsertTranslation(idx, { localeCode: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                  placeholder="tr, en, de..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlık
                </label>
                <input
                  value={t.title ?? ""}
                  onChange={(e) =>
                    upsertTranslation(idx, { title: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                  placeholder="Çeviri başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fiyat
                </label>
                <input
                  value={t.price ?? ""}
                  onChange={(e) =>
                    upsertTranslation(idx, { price: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                  placeholder="Örn: 6999₺"
                />
              </div>
              {/* ÇEVİRİ AÇIKLAMA — textarea */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={t.description ?? ""}
                  onChange={(e) =>
                    upsertTranslation(idx, { description: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                  placeholder="Çeviri açıklaması"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeTranslation(idx)}
                  className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-1.5 text-xs"
                >
                  Kaldır
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={!canSubmit || saving}
          className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm disabled:opacity-60"
        >
          {saving
            ? "Kaydediliyor..."
            : mode === "create"
            ? "Oluştur"
            : "Güncelle"}
        </button>
      </div>
    </form>
  );
}
