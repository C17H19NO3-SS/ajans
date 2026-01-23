// src/Components/Layout/Category/Search.tsx
import { useMemo, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import type { ProductCategory } from "@/Types/Product";
import Button from "../Button/Button";

type Props = {
  value: string;
  onChange: (v: string) => void;
  query: string;
  onQueryChange: (v: string) => void;
  onSubmitQuery: (value: string) => void;
  categories: ReadonlyArray<ProductCategory>;
  loading?: boolean;
};

export default function CategoryAndSearch({
  value,
  onChange,
  query,
  onQueryChange,
  onSubmitQuery,
  categories,
  loading,
}: Props) {
  const { t } = useTranslation("common");
  const filters = useMemo(
    () => [
      {
        key: "all",
        icon: "fas fa-th-large",
        label: t("products.filters.all", { defaultValue: "Tum Urunler" }),
      },
      ...categories.map((c) => ({
        key: c.id,
        icon: c.icon || "fas fa-tag",
        label: c.label,
      })),
    ],
    [categories, t]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmitQuery(event.currentTarget.value);
    }
  };

  const handleClear = () => {
    onQueryChange("");
    onSubmitQuery("");
  };

  return (
    <section className="bg-slate-50 py-4">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {filters.map((f) => (
              <Button
                key={f.key}
                size="sm"
                variant={value === f.key ? "primary" : "outline"}
                onClick={() => !loading && onChange(f.key)}
                className={loading ? "cursor-not-allowed opacity-50" : ""}
              >
                <i className={`${f.icon} mr-2`} />
                {f.label}
              </Button>
            ))}
          </div>

          <div className="w-full md:w-80">
            <label className="relative block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <i className="fas fa-search" />
              </span>
              <input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("products.search.placeholder", {
                  defaultValue: "Urunlerde ara...",
                })}
                className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoComplete="off"
                aria-busy={loading}
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={t("products.search.clear", {
                    defaultValue: "Temizle",
                  })}
                >
                  x
                </button>
              )}
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}