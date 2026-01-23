import React from "react";
import {
  Megaphone,
  Camera,
  Medal,
  LineChart,
  UserCog,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

type Item = {
  key: "social" | "visual" | "virtualTour" | "ads" | "consulting";
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  descDefault: string;
};

const entries: Item[] = [
  {
    key: "social",
    href: "/hizmetlerimiz/sosyal-medya-yonetimi",
    Icon: Medal,
    descDefault: "%150 growth guaranteed plans",
  },
  {
    key: "visual",
    href: "/hizmetlerimiz/gorsel-hizmetler",
    Icon: Camera,
    descDefault: "Drone shoots, photo & video production",
  },
  {
    key: "virtualTour",
    href: "/hizmetlerimiz/sanal-tur",
    Icon: LineChart,
    descDefault: "360° virtual tours & Google integration",
  },
  {
    key: "ads",
    href: "/hizmetlerimiz/reklam-yonetimi",
    Icon: Megaphone,
    descDefault: "Meta & Google Ads management",
  },
  {
    key: "consulting",
    href: "/hizmetlerimiz/uzman-danismanlik",
    Icon: UserCog,
    descDefault: "Influencer marketing & strategy",
  },
];

export const ServicesDropdown = () => {
  const { t } = useTranslation();

  return (
    <div
      role="menu"
      aria-label={t("nav.services")}
      className="pointer-events-auto w-[680px] max-w-[92vw] rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5"
    >
      {/* Başlık */}
      <div className="px-6 pt-6 text-center">
        <h3 className="text-xl font-semibold text-slate-900">
          {t("servicesDropdown.title", {
            defaultValue: "Digital Marketing Services",
          })}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {t("servicesDropdown.subtitle", {
            defaultValue: "150% growth-backed digital solutions",
          })}
        </p>
      </div>

      <div className="my-5 h-px w-full bg-slate-100" />

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 px-4 pb-4 sm:grid-cols-2">
        {entries.map(({ key, href, Icon, descDefault }) => (
          <a
            key={key}
            href={href}
            className="group flex items-start gap-3 rounded-xl border border-transparent bg-slate-50/70 p-4 transition hover:border-slate-200 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/60"
          >
            <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/20 ring-1 ring-white/20">
              <Icon className="h-5 w-5" />
            </span>
            <span className="block">
              <span className="block text-[15px] font-semibold text-slate-900">
                {t(`services.${key}`)}
              </span>
              <span className="mt-1 block text-sm text-slate-500">
                {t(`servicesDropdown.descriptions.${key}`, {
                  defaultValue: descDefault,
                })}
              </span>
            </span>
          </a>
        ))}
      </div>

      <div className="mx-6 mb-6 mt-2 border-t border-slate-100 pt-4">
        <a
          href="/hizmetlerimiz"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-slate-800 px-4 py-3 text-sm font-semibold text-white shadow transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/60"
        >
          {t("actions.viewAllServices")}
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};
