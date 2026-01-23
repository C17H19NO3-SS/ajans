import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { FadeIn, FadeInItem, FadeInStagger } from "@/Components/Common/Motion";

/* ----------------------------- Reusable UI ----------------------------- */
function SectionTitle({
  icon,
  title1,
  title2,
  subtitle,
  center = true,
}: {
  icon?: string;
  title1: string;
  title2?: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center mb-12" : "mb-8"}>
      {icon && (
        <span className="inline-grid place-items-center w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 shadow mb-3">
          <i className={icon} />
        </span>
      )}
      <h2 className="text-2xl md:text-3xl font-extrabold text-[color:var(--secondary-color)]">
        {title1}{" "}
        {title2 && (
          <span className="text-[color:var(--primary-color)]">{title2}</span>
        )}
      </h2>
      {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
    </div>
  );
}

function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
}: {
  children: ReactNode;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-md font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";
  const sizes =
    size === "sm"
      ? "px-3 py-2 text-sm"
      : size === "lg"
      ? "px-6 py-3 text-base"
      : "px-5 py-2.5 text-sm";
  const styles =
    variant === "primary"
      ? "bg-[color:var(--primary-color)] text-white shadow hover:opacity-95"
      : "border border-[color:var(--primary-color)] text-[color:var(--primary-color)] hover:bg-indigo-50";
  const cls = `${base} ${sizes} ${styles} ${className}`;
  return href ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

/* --------------------------------- HERO -------------------------------- */
function ServicesHero() {
  const { t } = useTranslation("common");
  return (
    <FadeIn as="section" className="hero-section" distance={40} trigger="load">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeInStagger as="div" className="mb-8 lg:mb-0" stagger={0.15} trigger="load">
            <FadeInItem className="hero-content" distance={24}>
              <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 text-[color:var(--primary-color)] px-4 py-2 font-semibold">
                {t("services.hero.badge", {
                  defaultValue: "Dijital Pazarlama Ajansı",
                })}
              </span>
              <h1 className="mt-4 text-4xl font-extrabold text-[color:var(--secondary-color)]">
                {t("services.hero.title1", { defaultValue: "Profesyonel" })}{" "}
                <span className="text-[color:var(--primary-color)]">
                  {t("services.hero.title2", { defaultValue: "Hizmetlerimiz" })}
                </span>
              </h1>
              <p className="mt-4 text-lg leading-7 text-slate-600">
                {t("services.hero.desc", {
                  defaultValue:
                    "Sosyal medya yönetimi, sanal tur çekimleri, reklam kampanyaları ve görsel içerik üretimi ile markanızı dijital dünyada büyütüyoruz.",
                })}
              </p>
              <FadeInStagger className="mt-6 flex gap-3" stagger={0.12} trigger="load">
                <FadeInItem>
                  <Button href="/urunler">
                    {t("services.hero.cta1", {
                      defaultValue: "Paketleri İnceleyin",
                    })}
                  </Button>
                </FadeInItem>
                <FadeInItem>
                  <Button variant="outline" href="/iletisim">
                    {t("services.hero.cta2", {
                      defaultValue: "İletişime Geçin",
                    })}
                  </Button>
                </FadeInItem>
              </FadeInStagger>

              <FadeInItem distance={20} className="mt-6">
                <div className="rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-sm">
                  <h2 className="text-xl font-semibold text-[color:var(--secondary-color)]">
                    {t("services.section.title1", { defaultValue: "Kapsamlı" })}{" "}
                    <span className="text-[color:var(--primary-color)]">
                      {t("services.section.title2", {
                        defaultValue: "Dijital Çözümler",
                      })}
                    </span>
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {t("services.section.subtitle", {
                      defaultValue:
                        "Sosyal medya yönetiminden sanal turlara, reklam kampanyalarından danışmanlığa kadar çözümler",
                    })}
                  </p>
                </div>
              </FadeInItem>
            </FadeInItem>
          </FadeInStagger>

          <FadeIn
            as="div"
            className="relative"
            direction="up"
            distance={32}
            delay={0.1}
            trigger="load"
          >
            <img
              src="https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&w=1400&q=80"
              alt={t("services.hero.imgAlt", {
                defaultValue: "Dijital Hizmetler",
              })}
              className="w-full rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] object-cover"
            />
            <FadeInItem
              as="div"
              className="absolute top-0 right-0 -translate-y-1/2 sm:-translate-y-1/3 bg-white p-3 rounded-full shadow hidden md:grid place-items-center w-20 h-20"
              direction="down"
              distance={10}
              trigger="load"
            >
              <i className="fas fa-rocket text-[color:var(--primary-color)] text-3xl" />
            </FadeInItem>
            <FadeInItem
              as="div"
              className="absolute bottom-0 left-0 translate-y-1/2 sm:translate-y-1/3 bg-white p-3 rounded-full shadow hidden md:grid place-items-center w-20 h-20"
              direction="up"
              distance={10}
              trigger="load"
            >
              <i className="fas fa-chart-line text-[color:var(--primary-color)] text-3xl" />
            </FadeInItem>
          </FadeIn>
        </div>
      </div>
    </FadeIn>
  );
}

/* ------------------------------ SERVICE BLOCK ---------------------------- */
function ServiceBlock({
  number,
  title1,
  title2,
  desc,
  bullets,
  image,
  badge,
  cta,
  reverse = false,
}: {
  number: string;
  title1: string;
  title2: string;
  desc: string;
  bullets: string[];
  image: string;
  badge: string;
  cta?: { label: string; href: string };
  reverse?: boolean;
}) {
  return (
    <div
      className={`grid items-center gap-10 lg:grid-cols-2 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div>
        <div className="relative overflow-hidden rounded-xl shadow">
          <img
            src={image}
            alt={title1}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 w-full bg-black/70 px-3 py-2 text-white">
            <div className="flex items-center gap-2">
              <span className="badge bg-primary">{badge}</span>
              <h5 className="m-0 text-sm font-semibold">
                {title1} {title2}
              </h5>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-3">
          <span
            className="inline-grid h-12 w-12 place-items-center rounded-full bg-[color:var(--primary-color)] text-white shadow"
            style={{ fontWeight: "bold", fontSize: 18 }}
          >
            {number}
          </span>
          <h3 className="section-title m-0">
            {title1}{" "}
            <span className="text-[color:var(--primary-color)]">{title2}</span>
          </h3>
        </div>
        <p className="text-slate-700">{desc}</p>
        {bullets?.length > 0 && (
          <ul className="check-list mt-3 space-y-1">
            {bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
        {cta?.label && (
          <Button href={cta.href} className="mt-4">
            {cta.label}
          </Button>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- PAGE --------------------------------- */
export default function ServicesPage() {
  const { t } = useTranslation("common");
  return (
    <main>
      <ServicesHero />

      {/* Başlık */}
      <section id="hizmetler" className="services-section py-12">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionTitle
            icon="fas fa-cogs"
            title1={t("services.section.title1", { defaultValue: "Kapsamlı" })}
            title2={t("services.section.title2", {
              defaultValue: "Dijital Çözümler",
            })}
            subtitle={t("services.section.subtitle", {
              defaultValue:
                "Sosyal medya yönetiminden sanal turlara, reklam kampanyalarından danışmanlığa kadar çözümler",
            })}
          />

          {/* 01 */}
          <ServiceBlock
            number="01"
            title1="Sosyal Medya"
            title2="Yönetimi"
            desc="Markanızın sosyal medya hesaplarını profesyonel ekibimizle yönetiyoruz. Gold ve Platinum paketlerimizle %150 organik büyüme garantisi sunuyoruz. Stratejik içerik planları ve hedefli reklam kampanyaları ile markanızı büyütüyoruz."
            bullets={[
              "%150 organik büyüme garantisi",
              "Detaylı performans raporları",
              "Stratejik içerik planlama",
            ]}
            image="https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=1400&q=80"
            badge="SM"
          />

          {/* 02 */}
          <ServiceBlock
            number="02"
            title1="Görsel"
            title2="İçerik Hizmetleri"
            desc="Profesyonel drone çekimleri, fotoğraf ve video prodüksiyon hizmetleri sunuyoruz. Markanızın görsel iletişimini güçlendiren yüksek kaliteli içerikler üretiyoruz. 4K kalitede çekim ve hızlı teslimat garantisi."
            bullets={[
              "4K kalitede çekim garantisi",
              "Hızlı teslimat süresi (3-5 gün)",
            ]}
            image="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1400&q=80"
            badge="İÜ"
            reverse
          />

          {/* 03 */}
          <ServiceBlock
            number="03"
            title1="Sanal Tur"
            title2="Hizmetleri"
            desc="Gayrimenkul, otel, restoran ve işletmeler için 360° sanal turlar hazırlıyoruz. Google My Business entegrasyonu ile müşterileriniz işletmenizi sanal olarak gezebilir. Emlak sektörü için özel çözümlerimizle satışlarınızı artırın."
            bullets={[
              "360° fotoğraf çekimi",
              "Interaktif gezinti deneyimi",
              "Mobil uyumlu görüntüleme",
            ]}
            image="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1400&q=80"
            badge="VR"
          />

          {/* 04 */}
          <ServiceBlock
            number="04"
            title1="Uzman"
            title2="Danışmanlık"
            desc="Markanızın dijital dönüşüm sürecinde uzman danışmanlık hizmeti alın. Influencer pazarlama, strateji geliştirme ve kampanya optimizasyonu konularında birebir danışmanlık sunuyoruz."
            bullets={[
              "Dijital strateji geliştirme",
              "Kampanya performans analizi",
              "ROI optimizasyonu",
            ]}
            image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80"
            badge="DS"
            reverse
          />
        </div>
      </section>

      {/* Hizmet Bilgilendirme */}
      <FadeIn
        as="section"
        className="services-section py-16 bg-white"
        distance={30}
      >
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <div className="icon-box inline-grid place-items-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 mb-4">
            <i className="fas fa-comments" />
          </div>
          <h2 className="text-3xl font-bold text-[color:var(--secondary-color)] mb-4">
            {t("services.info.title1", { defaultValue: "Hizmet" })}{" "}
            <span className="text-[color:var(--primary-color)]">
              {t("services.info.title2", { defaultValue: "Bilgilendirme" })}
            </span>
          </h2>
          <p className="lead mb-8 text-slate-600">
            {t("services.info.desc", {
              defaultValue:
                "Hizmetlerimiz ve paket detayları hakkında bilgi almak için bizimle iletişime geçin. Size özel çözümler sunuyoruz.",
            })}
          </p>

          <div className="grid gap-4 mb-8 sm:grid-cols-3">
            <div className="info-card text-center p-6 rounded-xl bg-white shadow ring-1 ring-slate-200">
              <div className="icon-box mb-3">
                <i className="fas fa-phone" />
              </div>
              <h5 className="font-semibold">Telefon</h5>
              <p className="m-0 text-slate-600">Detaylı bilgi alın</p>
            </div>
            <div className="info-card text-center p-6 rounded-xl bg-white shadow ring-1 ring-slate-200">
              <div className="icon-box mb-3">
                <i className="fas fa-envelope" />
              </div>
              <h5 className="font-semibold">E-posta</h5>
              <p className="m-0 text-slate-600">Yazılı teklif alın</p>
            </div>
            <div className="info-card text-center p-6 rounded-xl bg-white shadow ring-1 ring-slate-200">
              <div className="icon-box mb-3">
                <i className="fas fa-calendar" />
              </div>
              <h5 className="font-semibold">Randevu</h5>
              <p className="m-0 text-slate-600">Yüz yüze görüşün</p>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Button href="/iletisim" size="lg">
              {t("services.info.cta", { defaultValue: "Randevu Alın" })}
            </Button>
          </div>
        </div>
      </FadeIn>
    </main>
  );
}

