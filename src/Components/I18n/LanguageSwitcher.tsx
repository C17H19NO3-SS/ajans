import { useTranslation } from "react-i18next";
import clsx from "clsx";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || "tr").slice(
    0,
    2
  ) as "tr" | "en";

  const Item = ({ code, label }: { code: "tr" | "en"; label: string }) => (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(code)}
      aria-pressed={current === code}
      className={clsx(
        "relative inline-flex items-center px-0.5 text-sm font-medium transition",
        current === code
          ? "text-slate-900"
          : "text-slate-600 hover:text-slate-900",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/60 rounded"
      )}
    >
      <span className="select-none">{label}</span>
      {/* küçük nokta */}
      <span
        aria-hidden
        className={clsx(
          "pointer-events-none absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
          current === code ? "bg-indigo-600" : "bg-transparent"
        )}
      />
    </button>
  );

  return (
    <div
      className={clsx("inline-flex items-center gap-3", className)}
      role="group"
      aria-label="Language"
    >
      <Item code="tr" label="TR" />
      <span className="text-slate-300">/</span>
      <Item code="en" label="EN" />
    </div>
  );
}

