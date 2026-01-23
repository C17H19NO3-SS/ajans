// src/Pages/Contact/ContactHero.tsx
import { useTranslation } from "react-i18next";
import { siteConfig } from "@/data/site";
import { FadeIn, FadeInItem, FadeInStagger } from "@/Components/Common/Motion";

export default function ContactHero() {
  const { t } = useTranslation("common");
  const phoneHref = siteConfig.contact.phoneHref || siteConfig.contact.phone;

  const contactEmail = siteConfig.contact.email;
  const channelItems = [
    {
      icon: "fas fa-envelope-open",
      label: t("contact.hero.channelMail", { defaultValue: "E-posta" }),
      desc: contactEmail,
      hint: t("contact.hero.channelMailDesc", {
        defaultValue: "Her zaman yanıt veriyoruz",
      }),
      href: `mailto:${contactEmail}`,
    },
    {
      icon: "fas fa-phone-volume",
      label: t("contact.hero.channelPhone", { defaultValue: "Telefon" }),
      desc: siteConfig.contact.phone,
      hint: t("contact.hero.channelPhoneDesc", {
        defaultValue: "Hafta içi 09:00-18:00",
      }),
      href: `tel:${phoneHref}`,
    },
    {
      icon: "fas fa-comments",
      label: t("contact.hero.channelWhatsapp", { defaultValue: "WhatsApp" }),
      desc: siteConfig.contact.phone,
      hint: t("contact.hero.channelWhatsappDesc", {
        defaultValue: "Anlık mesajlaşma desteği",
      }),
      href: `https://wa.me/${phoneHref}`,
    },
  ];

  const stats = [
    {
      value: "2s",
      label: t("contact.hero.statResponse", { defaultValue: "Ortalama dönüş" }),
    },
    {
      value: "150+",
      label: t("contact.hero.statProjects", {
        defaultValue: "Tamamlanan proje",
      }),
    },
    {
      value: "4.9/5",
      label: t("contact.hero.statRating", { defaultValue: "Müşteri puanı" }),
    },
  ];

  const scrollToForm = () => {
    const target = document.getElementById("iletisim-formu");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <FadeIn as="section" className="hero-section" distance={42}>
      <div className="mx-auto max-w-[1200px] px-6 pt-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeInStagger className="space-y-8" stagger={0.18}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--primary-color)] shadow">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--primary-color)] text-white">
                <i className="fas fa-location-arrow text-[10px]" />
              </span>
              {t("contact.hero.badge", { defaultValue: "İletişime Geçin" })}
            </div>

            <div>
              <h1 className="text-4xl font-bold leading-tight text-[color:var(--secondary-color)] md:text-5xl">
                {t("contact.hero.title1", { defaultValue: "İletişim" })}{" "}
                <span className="text-[color:var(--primary-color)]">
                  {t("contact.hero.title2", { defaultValue: "Kanalları" })}
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                {t("contact.hero.desc", {
                  defaultValue:
                    "Projeleriniz ve sorularınız için size en uygun kanalı seçin. Ekibimiz ortalama iki saat içinde dönüş sağlıyor.",
                })}
              </p>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3">
                {channelItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="group flex w-full items-center gap-4 rounded-xl border border-indigo-100 bg-white px-5 py-4 text-left transition hover:-translate-y-0.5 hover:border-[color:var(--primary-color)]/30 hover:shadow-md"
                  >
                    <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[color:var(--primary-color)]">
                      <i className={item.icon} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold leading-tight text-[color:var(--secondary-color)]">
                        {item.label}
                      </span>
                      <span className="mt-1 block truncate text-sm font-medium text-[color:var(--primary-color)]">
                        {item.desc}
                      </span>
                      <span className="text-xs text-slate-500">{item.hint}</span>
                    </div>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--primary-color)] opacity-0 transition group-hover:opacity-100">
                      {t("contact.hero.channelAction", { defaultValue: "Detaya Git" })}
                      <i className="fas fa-arrow-right" />
                    </span>
                  </a>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="inline-flex flex-1 min-w-[160px] items-center justify-center gap-2 rounded-2xl bg-[color:var(--primary-color)] px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <i className="fas fa-paper-plane" />
                  {t("contact.hero.ctaSend", { defaultValue: "Mesaj Gönder" })}
                </button>
                <a
                  href={`tel:${phoneHref}`}
                  className="inline-flex flex-1 min-w-[160px] items-center justify-center gap-2 rounded-2xl border border-[color:var(--primary-color)] bg-white px-5 py-3 font-semibold text-[color:var(--primary-color)] shadow-sm transition hover:-translate-y-0.5 hover:border-transparent hover:bg-[color:var(--primary-color)] hover:text-white"
                >
                  <i className="fas fa-phone" />
                  {t("contact.hero.ctaCall", { defaultValue: "Şimdi Ara" })}
                </a>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {stats.map((item) => (
                <FadeInItem
                  key={item.label}
                  className="rounded-2xl border border-indigo-50 bg-white/80 px-4 py-3 text-left shadow-sm"
                  distance={12}
                >
                  <div className="text-2xl font-bold text-[color:var(--secondary-color)]">
                    {item.value}
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>
                </FadeInItem>
              ))}
            </div>
          </FadeInStagger>

          <FadeIn
            as="div"
            className="relative"
            distance={50}
            direction="up"
            delay={0.15}
          >
            <img
              src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1400&q=80"
              alt={t("contact.hero.imageAlt", { defaultValue: "Destek ekibi" })}
              className="h-full w-full rounded-[32px] object-cover shadow-[0_20px_45px_rgba(15,23,42,0.12)]"
            />
            <FadeIn
              as="div"
              className="absolute left-6 bottom-6 hidden max-w-[220px] rounded-2xl bg-white/95 p-5 shadow-xl backdrop-blur md:block"
              delay={0.3}
              direction="up"
              distance={18}
            >
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--primary-color)]">
                <i className="fas fa-star" />
                {t("contact.hero.widgetTitle", {
                  defaultValue: "Müşteri Mutluluğu",
                })}
              </span>
              <p className="mt-2 text-sm font-medium text-[color:var(--secondary-color)]">
                4.9/5 TrustScore
              </p>
              <p className="text-xs text-slate-500">
                320 {t("contact.hero.widgetReviews", { defaultValue: "yorum" })}
              </p>
            </FadeIn>
          </FadeIn>
        </div>
      </div>
    </FadeIn>
  );
}
