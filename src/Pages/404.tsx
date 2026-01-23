import React from "react";
import { ArrowLeft, LifeBuoy, Rocket } from "lucide-react";
import { useTranslation } from "react-i18next";

export const _404 = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-[#fbfcff]">
      {/* dekoratif arka plan */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(79,97,171,0.18),_transparent_60%)]" />
      <div className="pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(79,97,171,0.12),_transparent_60%)]" />

      <main className="mx-auto flex max-w-7xl flex-col items-center px-4 py-16 sm:px-6 lg:px-8">
        {/* logo rozet */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl ring-1 ring-black/5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md">
            <Rocket className="h-5 w-5" />
          </div>
        </div>

        {/* başlıklar */}
        <p className="mt-6 text-sm font-semibold tracking-widest text-[#2f4ca1]">
          404
        </p>
        <h1 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {t("notFound.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-center text-[15px] leading-7 text-slate-600">
          {t("notFound.subtitle")}
        </p>

        {/* kart */}
        <div className="mt-10 w-full max-w-2xl rounded-2xl border border-white/60 bg-white p-6 shadow-[0_25px_60px_-15px_rgba(43,64,128,0.18)]">
          <div className="rounded-xl bg-slate-50/70 p-4 text-slate-700">
            {t("notFound.desc")}
          </div>

          {/* CTA'lar */}
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#2f4ca1] shadow-sm hover:bg-indigo-50"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("notFound.homeCta")}
            </a>
            <a
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-xl bg-[#3b5bcc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3250b8]"
            >
              <LifeBuoy className="h-4 w-4" />
              {t("notFound.contactCta")}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};
