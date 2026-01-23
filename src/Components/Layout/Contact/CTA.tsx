// src/Pages/Contact/ContactCTA.tsx
import { useTranslation } from "react-i18next";
import { siteConfig } from "@/data/site";
import { FadeIn, FadeInItem, FadeInStagger } from "@/Components/Common/Motion";

export default function ContactCTA() {
  const { t } = useTranslation("common");
  const phoneHref = siteConfig.contact.phoneHref || siteConfig.contact.phone;
  const contactEmail = siteConfig.contact.email;

  return (
    <FadeIn as="section" className="relative overflow-hidden bg-gradient-to-br from-[#1f2dac] via-[#2636d8] to-[#101763] py-20 text-white" direction="none" distance={0}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <FadeInStagger className="space-y-6 lg:col-span-7" stagger={0.15}>
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
              <i className="fas fa-comments text-xl" />
            </span>
            <h2 className="text-3xl font-bold md:text-4xl">
              {t("cta.title", { defaultValue: "Hemen iletişime" })}{" "}
              <span className="border-b border-white pb-1">
                {t("cta.titleTail", { defaultValue: "geçin" })}
              </span>
            </h2>
            <p className="text-lg text-white/80">
              {t("cta.desc", {
                defaultValue: "Projeleriniz için size özel danışmanlık desteği sunuyoruz.",
              })}
            </p>
            <FadeInStagger className="flex flex-wrap gap-3" stagger={0.12}>
              <FadeInItem
                as="a"
                href={`tel:${phoneHref}`}
                className="inline-flex items-center gap-3 rounded-xl bg-white px-5 py-3 font-semibold text-[color:var(--primary-color)] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <i className="fas fa-phone" />
                {t("cta.ctaCall", { defaultValue: "Ara" })}
              </FadeInItem>
              <FadeInItem
                as="a"
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-3 rounded-xl border border-white/50 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:border-white"
              >
                <i className="fas fa-envelope" />
                {t("cta.ctaMail", { defaultValue: "E-posta Gönder" })}
              </FadeInItem>
            </FadeInStagger>

            <FadeInStagger className="grid gap-3 sm:grid-cols-3" stagger={0.1}>
              {[{
                icon: "fas fa-user-check",
                label: t("cta.statClients", { defaultValue: "280+ aktif müşteri" }),
              },
              {
                icon: "fas fa-clock",
                label: t("cta.statTime", { defaultValue: "2 saat içinde ilk dönüş" }),
              },
              {
                icon: "fas fa-star",
                label: t("cta.statSatisfaction", { defaultValue: "%96 memnuniyet" }),
              }].map((item) => (
                <FadeInItem
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
                    <i className={item.icon} />
                  </span>
                  <span className="font-medium">{item.label}</span>
                </FadeInItem>
              ))}
            </FadeInStagger>
          </FadeInStagger>

          <FadeIn as="div" className="lg:col-span-5" direction="up" distance={28} delay={0.1}>
            <FadeIn className="relative mx-auto max-w-sm overflow-hidden rounded-[32px] bg-white/10 p-8 text-center backdrop-blur" direction="up" distance={18}>
              <div className="mx-auto grid h-32 w-32 place-items-center rounded-full bg-white/15 text-center">
                <div>
                  <div className="text-3xl font-extrabold">24/7</div>
                  <div className="text-sm opacity-90">
                    {t("cta.support", { defaultValue: "Destek" })}
                  </div>
                </div>
              </div>
              <p className="mt-5 text-sm opacity-80">
                {t("cta.helper", {
                  defaultValue: "Acil durumlar için günün her saati WhatsApp ve e-posta desteği sağlıyoruz.",
                })}
              </p>
              <FadeInItem
                as="a"
                href="#iletisim-formu"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[color:var(--primary-color)] shadow transition hover:-translate-y-0.5 hover:opacity-90"
              >
                {t("cta.secondary", { defaultValue: "Formu doldur" })}
                <i className="fas fa-arrow-right" />
              </FadeInItem>
            </FadeIn>
          </FadeIn>
        </div>
      </div>
    </FadeIn>
  );
}
