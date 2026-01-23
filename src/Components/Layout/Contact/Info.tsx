// src/Pages/Contact/ContactInfo.tsx
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { siteConfig } from "@/data/site";
import SectionTitle from "../Section/Title";
import { FadeIn, FadeInItem, FadeInStagger } from "@/Components/Common/Motion";

export default function ContactInfo() {
  const { t } = useTranslation("common");
  const phoneHref = siteConfig.contact.phoneHref || siteConfig.contact.phone;
  const phoneDisplay =
    siteConfig.contact.phone || siteConfig.contact.phoneHref || "";
  const contactEmail = siteConfig.contact.email;
  const addressLines = siteConfig.contact.addressLines || [];
  const workingHours = siteConfig.contact.workingHours || {};

  const Card = ({
    icon,
    title,
    children,
    cta,
  }: {
    icon: string;
    title: string;
    children: ReactNode;
    cta?: ReactNode;
  }) => (
    <FadeIn
      className="group relative h-full overflow-hidden rounded-3xl bg-white/90 p-6 shadow-lg shadow-indigo-100 ring-1 ring-indigo-50 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
      distance={26}
    >
      <span className="pointer-events-none absolute -top-12 right-2 h-28 w-28 translate-x-8 rounded-full bg-[color:var(--primary-color)]/10 blur-[110px] transition group-hover:opacity-100" />
      <div className="relative flex h-full flex-col text-left">
        <span className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-indigo-100 text-[color:var(--primary-color)] shadow-sm">
          <i className={icon} />
        </span>
        <h4 className="mb-3 text-lg font-semibold text-[color:var(--secondary-color)]">
          {title}
        </h4>
        <div className="mb-4 space-y-1 text-sm text-slate-600">{children}</div>
        {cta && <div className="mt-auto pt-3">{cta}</div>}
      </div>
    </FadeIn>
  );

  return (
    <FadeIn
      as="section"
      className="relative overflow-hidden py-20"
      distance={32}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-transparent via-white/80 to-transparent" />
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionTitle
          icon="fas fa-address-book"
          title1={t("contact.info.title1", { defaultValue: "Bize" })}
          title2={t("contact.info.title2", { defaultValue: "Ulaşın" })}
          subtitle={t("contact.info.subtitle", {
            defaultValue: "Size en uygun kanaldan iletişime geçin.",
          })}
        />

        <FadeInStagger className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4" stagger={0.12}>
          <Card
            icon="fas fa-map-marker-alt"
            title={t("contact.info.addressTitle", { defaultValue: "Adres" })}
            cta={
              <a
                href="#harita"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--primary-color)]/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--primary-color)] transition hover:border-[color:var(--primary-color)] hover:bg-indigo-50"
              >
                <i className="fas fa-map" />
                {t("contact.info.addressCta", { defaultValue: "Haritada Gör" })}
              </a>
            }
          >
            {addressLines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </Card>

          <Card
            icon="fas fa-phone"
            title={t("contact.info.phoneTitle", { defaultValue: "Telefon" })}
            cta={
              <a
                href={`tel:${phoneHref}`}
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--primary-color)]/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--primary-color)] transition hover:border-[color:var(--primary-color)] hover:bg-indigo-50"
              >
                <i className="fas fa-phone" />
                {t("contact.info.phoneCta", { defaultValue: "Hemen Ara" })}
              </a>
            }
          >
            <span>
              {t("contact.info.phone", {
                defaultValue: `Mobil: ${phoneDisplay}`,
              })}
            </span>
          </Card>

          <Card
            icon="fas fa-envelope"
            title={t("contact.info.mailTitle", { defaultValue: "E-posta" })}
            cta={
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--primary-color)]/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--primary-color)] transition hover:border-[color:var(--primary-color)] hover:bg-indigo-50"
              >
                <i className="fas fa-paper-plane" />
                {t("contact.info.mailCta", { defaultValue: "E-posta Gönder" })}
              </a>
            }
          >
            <span>
              {t("contact.info.mail", {
                defaultValue: `Genel: ${contactEmail}`,
              })}
            </span>
          </Card>

          <FadeIn
            className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 text-white shadow-lg shadow-indigo-200"
            distance={26}
            delay={0.05}
          >
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  <i className="fas fa-life-ring" />
                  {t("contact.info.supportBadge", { defaultValue: "Destek Merkezi" })}
                </div>
                <h4 className="mt-4 text-lg font-semibold">
                  {t("contact.info.supportTitle", {
                    defaultValue: "Nasıl yardımcı olabiliriz?",
                  })}
                </h4>
                <p className="mt-2 text-sm text-white/80">
                  {t("contact.info.supportDesc", {
                    defaultValue:
                      "Telefon, e-posta veya yerinde toplantı için uygun saatlerimizi görüntüleyin.",
                  })}
                </p>
                <FadeInStagger as="ul" className="mt-4 space-y-2 text-sm" stagger={0.15}>
                  <FadeInItem as="li" className="flex items-center gap-3" distance={12}>
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15">
                      <i className="fas fa-clock" />
                    </span>
                    <span>
                      <strong>{t("map.weekLabel", { defaultValue: "Hafta içi" })}:</strong>{" "}
                      {workingHours.week || "09:00 – 18:00"}
                    </span>
                  </FadeInItem>
                  <FadeInItem as="li" className="flex items-center gap-3" distance={12}>
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15">
                      <i className="fas fa-calendar-day" />
                    </span>
                    <span>
                      <strong>{t("map.satLabel", { defaultValue: "Cumartesi" })}:</strong>{" "}
                      {workingHours.saturday || "10:00 – 16:00"}
                    </span>
                  </FadeInItem>
                  <FadeInItem as="li" className="flex items-center gap-3" distance={12}>
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15">
                      <i className="fas fa-door-closed" />
                    </span>
                    <span>
                      <strong>{t("map.sunLabel", { defaultValue: "Pazar" })}:</strong>{" "}
                      {workingHours.sunday || t("map.hoursSun", { defaultValue: "Kapalı" })}
                    </span>
                  </FadeInItem>
                </FadeInStagger>
              </div>

              <FadeInItem
                as="a"
                href="#iletisim-formu"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-white/80"
                direction="right"
                distance={10}
              >
                {t("contact.info.supportCta", {
                  defaultValue: "Uygun saat seçip randevu oluşturun",
                })}
                <i className="fas fa-arrow-right" />
              </FadeInItem>
            </div>
          </FadeIn>
        </FadeInStagger>
      </div>
    </FadeIn>
  );
}
