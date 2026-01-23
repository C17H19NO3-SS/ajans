import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { FadeIn, FadeInItem, FadeInStagger } from "@/Components/Common/Motion";
import ozan from "@/Images/ozan.png";
import taha from "@/Images/taha.png";
import ilker from "@/Images/ilker.jpg";

/* ----------------------------- Shared UI ----------------------------- */
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

/* -------------------------------- Sections -------------------------------- */
function AboutHero() {
  const { t } = useTranslation("common");
  return (
    <FadeIn as="section" className="hero-section" distance={40}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeInStagger as="div" className="mb-8 lg:mb-0" stagger={0.15}>
            <FadeInItem className="hero-content" distance={24}>
              <span className="badge">
                {t("about.hero.badge", {
                  defaultValue: "2020'den Beri Hizmetinizdeyiz",
                })}
              </span>
              <h1>
                {t("about.hero.title1", { defaultValue: "Dijital Pazarlama" })}{" "}
                <span className="text-primary">
                  {t("about.hero.title2", { defaultValue: "Uzmanları" })}
                </span>
              </h1>
              <p className="lead">
                {t("about.hero.desc", {
                  defaultValue:
                    "2020'den beri dijital pazarlama alanında hizmet veren profesyonel ekibimiz ile markanızı dijital dünyada zirveye taşıyoruz. %150 organik büyüme garantili paketlerimiz ve yenilikçi çözümlerimizle işinizi büyütün.",
                })}
              </p>
            </FadeInItem>
          </FadeInStagger>

          <FadeIn
            as="div"
            className="relative"
            direction="up"
            distance={32}
            delay={0.1}
          >
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80"
              alt={t("about.hero.imgAlt", {
                defaultValue: "Taso Digital Ekibi",
              })}
              className="w-full rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] object-cover"
            />
            <FadeInItem
              as="div"
              className="absolute top-0 right-0 -translate-y-1/2 sm:-translate-y-1/3 bg-white p-3 rounded-full shadow hidden md:grid place-items-center w-20 h-20"
              direction="down"
              distance={10}
            >
              <i className="fas fa-users text-primary text-3xl" />
            </FadeInItem>
            <FadeInItem
              as="div"
              className="absolute bottom-0 left-0 translate-y-1/2 sm:translate-y-1/3 bg-white p-3 rounded-full shadow hidden md:grid place-items-center w-20 h-20"
              direction="up"
              distance={10}
            >
              <i className="fas fa-award text-primary text-3xl" />
            </FadeInItem>
          </FadeIn>
        </div>
      </div>
    </FadeIn>
  );
}

function StatsStrip() {
  const { t } = useTranslation("common");
  const Item = ({
    icon,
    number,
    text,
  }: {
    icon: string;
    number: string;
    text: string;
  }) => (
    <div className="stat-item">
      <div className="mb-1">
        <span className="icon-box mb-2 inline-grid place-items-center">
          <i className={icon} />
        </span>
        <div className="number">{number}</div>
      </div>
      <div className="text">{text}</div>
    </div>
  );
  return (
    <section className="stats-section">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <Item
            icon="fas fa-calendar-check"
            number="%150"
            text={t("about.stats.growth", {
              defaultValue: "%150 Organik Büyüme",
            })}
          />
          <Item
            icon="fas fa-project-diagram"
            number="200+"
            text={t("about.stats.clients", { defaultValue: "Mutlu Müşteri" })}
          />
          <Item
            icon="fas fa-trophy"
            number="1000+"
            text={t("about.stats.drone", { defaultValue: "Drone Çekimi" })}
          />
          <Item
            icon="fas fa-users"
            number="50+"
            text={t("about.stats.tour", { defaultValue: "Sanal Tur" })}
          />
        </div>
      </div>
    </section>
  );
}

function StorySection() {
  const { t } = useTranslation("common");
  return (
    <FadeIn
      as="section"
      className="services-section"
      distance={34}
      trigger="load"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <FadeInStagger
          className="grid items-center gap-10 lg:grid-cols-2 mb-5"
          stagger={0.18}
          trigger="load"
        >
          <FadeInItem>
            <div className="flex items-center mb-3 gap-3">
              <div
                className="rounded-full bg-primary text-white grid place-items-center"
                style={{
                  width: 46,
                  height: 46,
                  fontWeight: "bold",
                  fontSize: 18,
                  boxShadow: "0 5px 15px rgba(59, 90, 187, 0.2)",
                }}
              >
                01
              </div>
              <h3 className="section-title m-0">
                {t("about.story.title1", { defaultValue: "Hikayemiz ve" })}{" "}
                <span className="text-primary">
                  {t("about.story.title2", { defaultValue: "Deneyimlerimiz" })}
                </span>
              </h3>
            </div>
            <p>
              {t("about.story.description", {
                defaultValue: "about.story_description",
              })}
            </p>
            <ul className="check-list">
              <li>
                {t("about.story.b1", {
                  defaultValue:
                    "2020 yılında sosyal medya pazarlama alanında faaliyet göstermeye başladık",
                })}
              </li>
              <li>
                {t("about.story.b2", {
                  defaultValue:
                    "Drone çekimleri ve sanal tur hizmetleriyle portföyümüzü genişlettik",
                })}
              </li>
              <li>
                {t("about.story.b3", {
                  defaultValue:
                    "%150 organik büyüme garantili paketler geliştirdik",
                })}
              </li>
              <li>
                {t("about.story.b4", {
                  defaultValue:
                    "100+ başarılı proje ve mutlu müşterilerle büyümeye devam ediyoruz",
                })}
              </li>
            </ul>
          </FadeInItem>
          <FadeInItem direction="up" distance={28}>
            <div className="relative rounded overflow-hidden shadow">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80"
                alt={t("about.story.imgAlt", {
                  defaultValue: "Şirket Hikayesi",
                })}
                className="w-full h-auto"
              />
              <div className="absolute inset-x-0 bottom-0 w-full p-3 bg-black/75 text-white">
                <div className="flex items-center gap-2">
                  <span className="badge bg-primary">2010</span>
                  <h5 className="m-0">2020</h5>
                </div>
              </div>
            </div>
          </FadeInItem>
        </FadeInStagger>
      </div>
    </FadeIn>
  );
}

function ValuesSection() {
  const { t } = useTranslation("common");
  return (
    <>
      <section className="what-we-do">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionTitle
            icon="fas fa-compass"
            title1={t("about.values.title1", {
              defaultValue: "Misyon, Vizyon",
            })}
            title2={t("about.values.title2", {
              defaultValue: "ve Değerlerimiz",
            })}
            subtitle={t("about.values.subtitle", {
              defaultValue:
                "Değerlerimiz doğrultusunda belirlediğimiz misyon ve vizyonumuzla hizmet veriyoruz",
            })}
          />
        </div>
      </section>

      <FadeIn
        as="section"
        className="services-section bg-light-gray"
        distance={32}
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeInStagger className="grid gap-4 md:grid-cols-3" stagger={0.1}>
            <FadeInItem
              className="relative rounded overflow-hidden shadow h-full"
              distance={18}
            >
              <div className="service-card-content p-4 text-center h-full flex flex-col">
                <div className="icon-box mb-3 mx-auto">
                  <i className="fas fa-bullseye" />
                </div>
                <h4 className="mb-3">
                  {t("about.values.mission.title", {
                    defaultValue: "Misyonumuz",
                  })}
                </h4>
                <p className="grow">
                  {t("about.values.mission.text", {
                    defaultValue:
                      "Dijital pazarlama alanında yenilikçi ve etkili çözümler sunarak, müşterilerimizin işlerini büyütmelerine katkı sağlamak. Sosyal medya yönetimi, görsel içerik üretimi ve sanal tur hizmetleriyle markaların dijital dünyada güçlü bir varlık oluşturmalarını desteklemek.",
                  })}
                </p>
                <div className="absolute bottom-0 left-0 w-full p-3 bg-primary/10">
                  <div className="flex items-center justify-center gap-2">
                    <span className="badge bg-primary px-2 py-1 rounded-full text-white">
                      M
                    </span>
                    <small className="text-dark font-bold">
                      {t("about.values.mission.tag", {
                        defaultValue: "Misyon",
                      })}
                    </small>
                  </div>
                </div>
              </div>
            </FadeInItem>

            <FadeInItem
              className="relative rounded overflow-hidden shadow h-full"
              distance={18}
              delay={0.05}
            >
              <div className="service-card-content p-4 text-center h-full flex flex-col">
                <div className="icon-box mb-3 mx-auto">
                  <i className="fas fa-eye" />
                </div>
                <h4 className="mb-3">
                  {t("about.values.vision.title", {
                    defaultValue: "Vizyonumuz",
                  })}
                </h4>
                <p className="grow">
                  {t("about.values.vision.text", {
                    defaultValue:
                      "Türkiye'nin önde gelen dijital pazarlama ajansı olarak, teknoloji ve yaratıcılığı birleştirerek müşterilerimize en iyi hizmeti sunmak. Sürekli gelişen dijital dünyada öncü çözümler üreterek sektörde lider konuma ulaşmak.",
                  })}
                </p>
                <div className="absolute bottom-0 left-0 w-full p-3 bg-primary/10">
                  <div className="flex items-center justify-center gap-2">
                    <span className="badge bg-primary px-2 py-1 rounded-full text-white">
                      V
                    </span>
                    <small className="text-dark font-bold">
                      {t("about.values.vision.tag", { defaultValue: "Vizyon" })}
                    </small>
                  </div>
                </div>
              </div>
            </FadeInItem>

            <FadeInItem
              className="relative rounded overflow-hidden shadow h-full"
              distance={18}
              delay={0.1}
            >
              <div className="service-card-content p-4 text-center h-full flex flex-col">
                <div className="icon-box mb-3 mx-auto">
                  <i className="fas fa-gem" />
                </div>
                <h4 className="mb-3">
                  {t("about.values.values.title", {
                    defaultValue: "Değerlerimiz",
                  })}
                </h4>
                <p className="grow">
                  {t("about.values.values.text", {
                    defaultValue:
                      "Müşteri memnuniyeti, kaliteli hizmet, yenilikçilik ve güvenilirlik temel değerlerimizdir. Şeffaflık, dürüstlük ve profesyonellik ilkelerimizle uzun vadeli iş ortaklıkları kuruyoruz.",
                  })}
                </p>
                <div className="absolute bottom-0 left-0 w-full p-3 bg-primary/10">
                  <div className="flex items-center justify-center gap-2">
                    <span className="badge bg-primary px-2 py-1 rounded-full text-white">
                      D
                    </span>
                    <small className="text-dark font-bold">
                      {t("about.values.values.tag", {
                        defaultValue: "Değerler",
                      })}
                    </small>
                  </div>
                </div>
              </div>
            </FadeInItem>
          </FadeInStagger>
        </div>
      </FadeIn>
    </>
  );
}

/* -------------------------------- Team Section -------------------------------- */
function TeamSection() {
  const { t } = useTranslation("common");

  // === TÜM EKİP ÜYELERİ VE SOSYAL MEDYA LİNKLERİ BURADAN KONTROL EDİLİR ===
  const TEAM_MEMBERS = [
    {
      id: 1,
      name: "İlker Düzdaş",
      role: "Kurucu & CEO",
      bio: "10+ yıllık pazarlama deneyimi ile dijital stratejiler geliştiriyor.",
      img: ilker,
      socials: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        email: "mailto:ilker@tasodigital.com",
        instagram: "https://instagram.com",
      },
    },
    {
      id: 2,
      name: "Vehbi Taha Edis",
      role: "Web Tasarım & Geliştirme",
      bio: "Modern arayüzler ve güçlü altyapılarla kullanıcı dostu web deneyimleri tasarlıyor.",
      img: taha,
      socials: {
        linkedin: "https://www.linkedin.com/in/vehbi-taha-edis-28b369336/",
        instagram: "https://www.instagram.com/syncjs__/",
        email: "mailto:admin@morphine.com.tr",
      },
    },
    {
      id: 3,
      name: "Ozan Dijital",
      role: "Dijital Reklam Uzmanı",
      bio: "Google ve Meta reklamlarıyla markaların satışlarını ve geri dönüşümlerini (ROI) artırıyor.",
      img: ozan,
      socials: {
        linkedin: "https://linkedin.com",
        email: "mailto:ozan@tasodigital.com",
      },
    },
  ];

  const Card = ({
    img,
    name,
    role,
    bio,
    socials,
  }: {
    img: string;
    name: string;
    role: string;
    bio: string;
    socials: {
      linkedin?: string;
      twitter?: string;
      instagram?: string;
      email?: string;
    };
  }) => (
    <div className="h-full rounded-xl bg-white shadow ring-1 ring-slate-200 overflow-hidden flex flex-col">
      {/* 
          RESİM KAPSAYICISI 
          - aspect-[4/3]: En-boy oranını sabitler.
          - w-full: Genişliği doldurur.
          - overflow-hidden: Taşan kısımları gizler.
          - bg-gray-100: Resim yüklenene kadar gri arka plan.
      */}
      <div className="relative group aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={img}
          alt={name}
          // - object-cover: Resmi sündürmeden alanı doldurur.
          // - object-top: Yüzlerin kesilmemesi için yukarı hizalar.
          // - transition: Hover efektini yumuşatır.
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-end p-3">
          <div className="flex items-center gap-2 text-white text-sm">
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex w-8 h-8 rounded-full bg-white/20 backdrop-blur items-center justify-center hover:bg-white/30"
              >
                <i className="fab fa-linkedin-in" />
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="inline-flex w-8 h-8 rounded-full bg-white/20 backdrop-blur items-center justify-center hover:bg-white/30"
              >
                <i className="fab fa-twitter" />
              </a>
            )}
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex w-8 h-8 rounded-full bg-white/20 backdrop-blur items-center justify-center hover:bg-white/30"
              >
                <i className="fab fa-instagram" />
              </a>
            )}
            {socials.email && (
              <a
                href={socials.email}
                aria-label="E-posta"
                className="inline-flex w-8 h-8 rounded-full bg-white/20 backdrop-blur items-center justify-center hover:bg-white/30"
              >
                <i className="fas fa-envelope" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h5 className="font-semibold text-[color:var(--secondary-color)]">
          {name}
        </h5>
        <p className="text-sm text-[color:var(--primary-color)] m-0">{role}</p>
        <p className="mt-2 text-slate-600 text-[0.95rem]">{bio}</p>
      </div>
    </div>
  );

  return (
    <FadeIn
      as="section"
      id="ekibimiz"
      className="services-section"
      distance={30}
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionTitle
          icon="fas fa-users"
          title1={t("about.team.title1", { defaultValue: "Profesyonel" })}
          title2={t("about.team.title2", { defaultValue: "Ekibimiz" })}
          subtitle={t("about.team.subtitle", {
            defaultValue:
              "Alanında uzman, deneyimli ve yaratıcı ekibimizle projelerinizi hayata geçiriyoruz",
          })}
        />

        {/* 
            KARTLARI ORTALAMA 
            - flex flex-wrap justify-center gap-8: Kartları ortalar ve aralarına boşluk koyar.
        */}
        <FadeInStagger
          className="flex flex-wrap justify-center gap-8"
          stagger={0.1}
        >
          {TEAM_MEMBERS.map((member, index) => (
            <FadeInItem
              key={member.id}
              delay={index * 0.05}
              // - w-full max-w-[300px]: Mobilde tam genişlik, PC'de max 300px
              className="w-full max-w-[300px]"
            >
              <Card
                img={member.img}
                name={t(`about.team.members.${member.id}.name`, {
                  defaultValue: member.name,
                })}
                role={t(`about.team.members.${member.id}.role`, {
                  defaultValue: member.role,
                })}
                bio={t(`about.team.members.${member.id}.bio`, {
                  defaultValue: member.bio,
                })}
                socials={member.socials}
              />
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </FadeIn>
  );
}

function AboutCTA() {
  const { t } = useTranslation("common");
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-[900px] px-6 text-center">
        <span className="inline-grid place-items-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 mb-4">
          <i className="fas fa-hands-helping" />
        </span>
        <h2 className="text-3xl font-bold text-[color:var(--secondary-color)]">
          {t("about.cta.title", {
            defaultValue: "Ekibimizle tanışın ve projenizi büyütelim",
          })}
        </h2>
        <p className="mt-3 text-lg text-slate-600">
          {t("about.cta.desc", {
            defaultValue:
              "Özel ihtiyaçlarınıza göre çözümler üretelim. İletişime geçin veya randevu alın.",
          })}
        </p>
        <div className="mt-6 flex justify-center flex-wrap gap-3">
          <Button size="lg" href="/iletisim">
            <i className="fas fa-envelope-open mr-2" />
            {t("about.cta.primary", { defaultValue: "İletişime Geçin" })}
          </Button>
          <Button size="lg" variant="outline" href="#ekibimiz">
            <i className="fas fa-users mr-2" />
            {t("about.cta.secondary", { defaultValue: "Ekibi Gör" })}
          </Button>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- PAGE --------------------------------- */
export default function About() {
  return (
    <main>
      <AboutHero />
      <StatsStrip />
      <StorySection />
      <ValuesSection />
      <TeamSection />
      <AboutCTA />
    </main>
  );
}
