// src/Components/Pages/Product/ExtraSelector.tsx
import { useTranslation } from "react-i18next";
import type { UIExtra } from "@/Types/Product";

export function ExtrasSelector({
  extras,
  selected,
  onToggle,
}: {
  extras: UIExtra[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  const { t } = useTranslation("common");
  const list = extras ?? [];
  if (!list.length) return null;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {t("products.detail.extras", {
              defaultValue: "Opsiyonel ek hizmetler",
            })}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {t("products.detail.extrasDesc", {
              defaultValue:
                "Paketi zenginlestirmek icin tercih edebileceginiz ek servisler.",
            })}
          </p>
        </div>
        <i className="fas fa-puzzle-piece text-2xl text-[color:var(--primary-color)]" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {list.map((extra) => {
          const isSelected = selected.has(extra.id);
          const priceLabel =
            extra.priceLabel ??
            (extra.priceAmount && extra.priceAmount > 0
              ? `TRY ${extra.priceAmount.toLocaleString("tr-TR")}`
              : t("products.card.free", { defaultValue: "Ücretsiz" }));

          return (
            <label
              key={extra.id}
              className={`group relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 ring-1 transition
                        ${
                          isSelected
                            ? "border-emerald-200 ring-emerald-200 bg-emerald-50/30"
                            : "border-slate-200 ring-slate-200 hover:bg-slate-50"
                        }`}
            >
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-[color:var(--primary-color)] focus:ring-[color:var(--primary-color)]"
                checked={isSelected}
                onChange={() => onToggle(extra.id)}
                aria-label={extra.title}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-slate-800">
                      {extra.title}
                    </h3>
                    {extra.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {extra.description}
                      </p>
                    )}
                    {extra.type && (
                      <span className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 ring-1 ring-slate-200">
                        {extra.type === "subscription"
                          ? t("products.detail.subscription", {
                              defaultValue: "Abonelik",
                            })
                          : t("products.detail.optional", {
                              defaultValue: "Opsiyonel",
                            })}
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-[color:var(--primary-color)] ring-1 ring-indigo-100">
                    {priceLabel}
                  </span>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );
}
