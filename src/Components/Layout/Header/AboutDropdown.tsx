import React from "react";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

export const AboutDropdown = () => {
  const { t } = useTranslation();

  return (
    <div
      role="menu"
      aria-label={t("nav.about")}
      className="pointer-events-auto w-[260px] max-w-[92vw] rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5 p-3"
    >
      <a
        href="/hakkimizda"
        className="flex items-center gap-3 rounded-2xl border border-transparent bg-slate-50/70 px-4 py-3 transition hover:border-slate-200 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/60"
      >
        <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/20 ring-1 ring-white/20">
          <Info className="h-4 w-4" />
        </span>
        <span className="text-[15px] font-semibold text-[#2d4b8f]">
          {t("nav.about")}
        </span>
      </a>
    </div>
  );
};
