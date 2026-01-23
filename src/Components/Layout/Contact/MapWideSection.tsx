// src/Pages/Contact/MapWideSection.tsx
import { useTranslation } from "react-i18next";
import { siteConfig } from "@/data/site";
import { FadeIn } from "@/Components/Common/Motion";

export default function MapWideSection() {
  const { t } = useTranslation("common");
  const mapEmbedUrl = siteConfig.map.embedUrl;
  return (
    <FadeIn as="section" id="harita" className="py-20" distance={40}>
      <div className="mx-auto max-w-[1200px] px-6">
        <FadeIn className="relative overflow-hidden rounded-[40px] bg-white shadow-2xl shadow-indigo-100 ring-1 ring-indigo-100" distance={36}>
          <div className="aspect-[16/9] w-full">
            <iframe
              src={mapEmbedUrl}
              className="h-full w-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Large Map"
            />
          </div>

          <FadeIn className="absolute left-6 top-6 max-w-xs rounded-2xl bg-white/95 p-5 shadow-xl backdrop-blur" distance={20} delay={0.1}>
            <h3 className="text-lg font-semibold text-[color:var(--secondary-color)]">
              {siteConfig.contact.addressLines?.[0] ?? t("map.large.title", { defaultValue: "SyncJS Yazılım" })}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {(siteConfig.contact.addressLines || []).slice(1).join(" • ")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[color:var(--primary-color)]">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1">
                <i className="fas fa-route" />
                {t("map.large.navigation", { defaultValue: "Navigasyon" })}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1">
                <i className="fas fa-parking" />
                {t("map.large.parking", { defaultValue: "Ücretsiz otopark" })}
              </span>
            </div>
            <a
              href={mapEmbedUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--primary-color)] hover:text-[color:var(--primary-color)]/80"
            >
              {t("map.large.open", { defaultValue: "Google Haritalarda Aç" })}
              <i className="fas fa-arrow-up-right-from-square" />
            </a>
          </FadeIn>
        </FadeIn>
      </div>
    </FadeIn>
  );
}
