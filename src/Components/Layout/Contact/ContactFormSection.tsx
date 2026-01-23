// src/Pages/Contact/ContactFormSection.tsx
import { useMemo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { siteConfig } from "@/data/site";
import { FadeIn, FadeInItem, FadeInStagger } from "@/Components/Common/Motion";

const inputBase =
  "w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2 focus:border-[color:var(--primary-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500/70";
const FieldLabel = ({ children }: { children: ReactNode }) => (
  <label className="mb-1 block text-sm font-semibold text-slate-700">
    {children}
  </label>
);

export default function ContactFormSection() {
  const { t } = useTranslation("common");
  const mapEmbedUrl = siteConfig.map.embedUrl;
  const workingHours = siteConfig.contact.workingHours || {};
  const socialEntries = Object.entries(siteConfig.social || {});
  const socialIconMap: Record<string, string> = {
    facebook: "fab fa-facebook-f",
    twitter: "fab fa-twitter",
    instagram: "fab fa-instagram",
    linkedin: "fab fa-linkedin-in",
    youtube: "fab fa-youtube",
  };
  const contactEmail = siteConfig.contact.email;

  const contactReasons = useMemo(
    () => [
      t("form.reasons.project", {
        defaultValue: "Proje danışmanlığı",
      }),
      t("form.reasons.support", {
        defaultValue: "Teknik destek",
      }),
      t("form.reasons.offer", {
        defaultValue: "Teklif talebi",
      }),
      t("form.reasons.training", {
        defaultValue: "Eğitim / Workshop",
      }),
    ],
    [t]
  );

  return (
    <FadeIn
      as="section"
      id="iletisim-formu"
      className="relative overflow-hidden py-20"
      distance={36}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.1),transparent_65%)] lg:block" />
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-[36px] bg-white/95 p-8 shadow-2xl shadow-indigo-100 ring-1 ring-indigo-100 backdrop-blur">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-indigo-100 text-[color:var(--primary-color)] shadow-sm">
                    <i className="fas fa-paper-plane" />
                  </span>
                  <div>
                    <h2 id="contact-form-title" className="text-xl font-semibold text-[color:var(--secondary-color)]">
                      {t("form.title", { defaultValue: "Bize Yazın" })}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {t("form.subtitle", {
                        defaultValue:
                          "İhtiyacınızı birkaç cümleyle paylaşın, aynı gün içinde geri dönelim.",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--primary-color)]">
                  <i className="fas fa-shield-check" />
                  {t("form.badge", { defaultValue: "Verileriniz güvende" })}
                </div>
              </div>

              <FadeInStagger className="mb-6 flex flex-wrap gap-2" stagger={0.08}>
                {contactReasons.map((reason) => (
                  <FadeInItem
                    key={reason}
                    className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/60 px-3 py-1 text-xs font-medium text-[color:var(--primary-color)]"
                    distance={8}
                  >
                    <i className="fas fa-circle text-[8px]" />
                    {reason}
                  </FadeInItem>
                ))}
              </FadeInStagger>

              <form
                noValidate
                aria-labelledby="contact-form-title"
                className="space-y-5"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>
                      {t("form.fields.name", { defaultValue: "Ad Soyad" })}
                    </FieldLabel>
                    <input
                      className={inputBase}
                      required
                      placeholder="Örn. Ayşe Demir"
                    />
                  </div>
                  <div>
                    <FieldLabel>
                      {t("form.fields.email", { defaultValue: "E-posta" })}
                    </FieldLabel>
                    <input
                      type="email"
                      className={inputBase}
                      required
                      placeholder="ornek@eposta.com"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>
                    {t("form.fields.phone", { defaultValue: "Telefon" })}
                  </FieldLabel>
                  <input
                    type="tel"
                    className={inputBase}
                    placeholder="+90 5xx xxx xx xx"
                  />
                </div>

                <div>
                  <FieldLabel>
                    {t("form.fields.subject", { defaultValue: "Konu" })}
                  </FieldLabel>
                  <input
                    className={inputBase}
                    required
                    placeholder="Konu başlığı"
                  />
                </div>

                <div>
                  <FieldLabel>
                    {t("form.fields.message", { defaultValue: "Mesajınız" })}
                  </FieldLabel>
                  <textarea
                    className={inputBase}
                    rows={5}
                    required
                    placeholder="Mesajınızı yazın…"
                  />
                </div>

                <label className="flex items-start gap-2 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 rounded border-slate-300"
                  />
                  <a
                    href="/gizlilik"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline"
                  >
                    {t("form.privacy", {
                      defaultValue: "Gizlilik Politikasını kabul ediyorum",
                    })}
                  </a>
                </label>

                <input type="text" name="honeypot" className="hidden" />

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[color:var(--primary-color)] px-5 py-3 font-semibold text-white shadow-lg shadow-[color:var(--primary-color)]/20 transition hover:-translate-y-0.5 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 md:w-auto"
                >
                  {t("form.submit", { defaultValue: "Gönder" })}
                  <i className="fas fa-arrow-right" />
                </button>

                <FadeInItem as="div" className="text-sm text-slate-500" aria-live="polite" distance={6}>
                  {t("form.responseTime", {
                    defaultValue: "* Mesajlara aynı iş günü içinde yanıt veriyoruz",
                  })}
                </FadeInItem>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5">
            <FadeIn
              className="flex h-full flex-col justify-between rounded-[36px] bg-white/95 p-8 shadow-2xl shadow-indigo-100 ring-1 ring-indigo-100 backdrop-blur"
              distance={32}
              delay={0.08}
            >
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-indigo-100 text-[color:var(--primary-color)] shadow-sm">
                    <i className="fas fa-map" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-[color:var(--secondary-color)]">
                      {t("map.title", { defaultValue: "Harita" })}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {t("map.subtitle", {
                        defaultValue:
                          "Ofisimize uğramadan önce uygun olduğumuz saatleri kontrol edin.",
                      })}
                    </p>
                  </div>
                </div>

                <FadeIn className="w-full overflow-hidden rounded-2xl ring-1 ring-indigo-100" direction="up" distance={28} delay={0.1}>
                  <div className="aspect-[4/3] w-full">
                    <iframe
                      src={mapEmbedUrl}
                      className="h-full w-full"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Office Map"
                    />
                  </div>
                </FadeIn>

                <FadeIn className="mt-6 rounded-2xl bg-slate-50 p-5" distance={18}>
                  <h4 className="text-lg font-semibold text-[color:var(--secondary-color)]">
                    {t("map.hoursTitle", { defaultValue: "Çalışma Saatleri" })}
                  </h4>
                  <FadeInStagger as="ul" className="mt-3 space-y-2 text-sm text-slate-700" stagger={0.12}>
                    <FadeInItem as="li">
                      <strong>
                        {t("map.weekLabel", { defaultValue: "Hafta içi" })}
                      </strong>{" "}
                      {workingHours.week ||
                        t("map.hoursWeek", { defaultValue: "09:00 – 18:00" })}
                    </FadeInItem>
                    <FadeInItem as="li">
                      <strong>
                        {t("map.satLabel", { defaultValue: "Cumartesi" })}
                      </strong>{" "}
                      {workingHours.saturday ||
                        t("map.hoursSat", { defaultValue: "10:00 – 16:00" })}
                    </FadeInItem>
                    <FadeInItem as="li">
                      <strong>
                        {t("map.sunLabel", { defaultValue: "Pazar" })}
                      </strong>{" "}
                      {workingHours.sunday ||
                        t("map.hoursSun", { defaultValue: "Kapalı" })}
                    </FadeInItem>
                  </FadeInStagger>
                </FadeIn>
              </div>

              <div>
                <div>
                  <h4 className="text-lg font-semibold text-[color:var(--secondary-color)]">
                    {t("map.socialTitle", { defaultValue: "Sosyal Medya" })}
                  </h4>
                  <FadeInStagger className="mt-3 flex flex-wrap items-center gap-3 text-[color:var(--primary-color)]" stagger={0.08}>
                    {socialEntries.map(([key, url]) => {
                      const icon =
                        socialIconMap[key as keyof typeof socialIconMap] ??
                        "fas fa-globe";
                      return (
                        <FadeInItem
                          as="a"
                          key={key}
                          href={url}
                          aria-label={key}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-lg transition hover:bg-[color:var(--primary-color)] hover:text-white"
                          target="_blank"
                          rel="noreferrer"
                          distance={8}
                        >
                          <i className={icon} />
                        </FadeInItem>
                      );
                    })}
                  </FadeInStagger>
                </div>

                <FadeIn
                  className="mt-6 flex items-center gap-3 rounded-2xl bg-indigo-50/70 px-4 py-3 text-sm text-[color:var(--primary-color)]"
                  distance={14}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[color:var(--primary-color)]">
                    <i className="fas fa-envelope-open" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-[color:var(--secondary-color)]/70">
                      {t("map.contactMailLabel", { defaultValue: "E-posta" })}
                    </span>
                    {t("map.contactMail", { defaultValue: "E-posta:" })} {contactEmail}
                  </span>
                </FadeIn>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
