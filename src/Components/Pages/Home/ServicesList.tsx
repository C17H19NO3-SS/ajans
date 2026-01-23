import { ServiceFeature } from "./ServiceFeature";
import home1 from "@/Images/home1.avif";
import home2 from "@/Images/home2.avif";
import home3 from "@/Images/home3.avif";
import home4 from "@/Images/home4.avif";
import { useTranslation } from "react-i18next";
import { FadeIn, FadeInItem, FadeInStagger } from "@/Components/Common/Motion";

export const ServicesList = () => {
  const { t } = useTranslation("common");

  const services = [
    {
      index: 1,
      title: t("home.servicesList.social.title", { defaultValue: "Sosyal Medya Yönetimi" }),
      description: t("home.servicesList.social.description", {
        defaultValue:
          "Markanızın sosyal medya hesaplarını profesyonel ekibimizle yönetiyoruz. Stratejik içerik planları ve hedefli reklam kampanyaları ile organik büyümeyi artırıyoruz.",
      }),
      bullets: [
        t("home.servicesList.social.bullets.0", { defaultValue: "Gold paket" }),
        t("home.servicesList.social.bullets.1", { defaultValue: "Platinum paket" }),
        t("home.servicesList.social.bullets.2", { defaultValue: "%150 organik büyüme" }),
        t("home.servicesList.social.bullets.3", { defaultValue: "Stratejik içerik planlama" }),
        t("home.servicesList.social.bullets.4", { defaultValue: "Meta ve Google Ads yönetimi" }),
      ],
      cta: t("home.servicesList.social.cta", { defaultValue: "Paketleri incele" }),
      to: "/hizmetlerimiz/sosyal-medya-yonetimi",
      image: home1,
      badge: t("home.servicesList.social.badge", { defaultValue: "SM" }),
      label: t("home.servicesList.social.label", { defaultValue: "Sosyal Medya Uzmanı" }),
      reverse: false,
    },
    {
      index: 2,
      title: t("home.servicesList.virtualTour.title", { defaultValue: "Sanal Tur Hizmetleri" }),
      description: t("home.servicesList.virtualTour.description", {
        defaultValue:
          "Emlak, otel, restoran ve işletmeler için 360° sanal turlar hazırlıyoruz. Google Business entegrasyonu ile müşterileriniz mekanınızı sanal olarak gezebilir.",
      }),
      bullets: [
        t("home.servicesList.virtualTour.bullets.0", { defaultValue: "Emlak sanal turu" }),
        t("home.servicesList.virtualTour.bullets.1", { defaultValue: "Google Business entegrasyonu" }),
        t("home.servicesList.virtualTour.bullets.2", { defaultValue: "360° fotoğraf çekimi" }),
        t("home.servicesList.virtualTour.bullets.3", { defaultValue: "İnteraktif deneyim" }),
        t("home.servicesList.virtualTour.bullets.4", { defaultValue: "Mobil uyumlu görüntüleme" }),
      ],
      cta: t("home.servicesList.virtualTour.cta", { defaultValue: "Sipariş ver" }),
      to: "/hizmetlerimiz/sanal-tur",
      image: home2,
      badge: t("home.servicesList.virtualTour.badge", { defaultValue: "VR" }),
      label: t("home.servicesList.virtualTour.label", { defaultValue: "360 Sanal Turlar" }),
      reverse: true,
    },
    {
      index: 3,
      title: t("home.servicesList.visual.title", { defaultValue: "Görsel Hizmetler" }),
      description: t("home.servicesList.visual.description", {
        defaultValue:
          "Profesyonel drone çekimleri, fotoğraf ve video prodüksiyon hizmetleri sunuyoruz. Markanızın görsel iletişimini güçlendiren içerikler üretiyoruz.",
      }),
      bullets: [
        t("home.servicesList.visual.bullets.0", { defaultValue: "Drone çekimleri" }),
        t("home.servicesList.visual.bullets.1", { defaultValue: "Profesyonel fotoğraf" }),
        t("home.servicesList.visual.bullets.2", { defaultValue: "Video prodüksiyon" }),
        t("home.servicesList.visual.bullets.3", { defaultValue: "4K kalite" }),
        t("home.servicesList.visual.bullets.4", { defaultValue: "Hızlı teslimat" }),
      ],
      cta: t("home.servicesList.visual.cta", { defaultValue: "Hizmetleri incele" }),
      to: "/hizmetlerimiz/gorsel-hizmetler",
      image: home3,
      badge: t("home.servicesList.visual.badge", { defaultValue: "DR" }),
      label: t("home.servicesList.visual.label", { defaultValue: "Drone & Fotoğraf Çekimi" }),
      reverse: false,
    },
    {
      index: 4,
      title: t("home.servicesList.consulting.title", { defaultValue: "Dijital Pazarlama Danışmanlığı" }),
      description: t("home.servicesList.consulting.description", {
        defaultValue:
          "Influencer pazarlama, strateji geliştirme ve kampanya optimizasyonu konularında birebir danışmanlık sunuyoruz.",
      }),
      bullets: [
        t("home.servicesList.consulting.bullets.0", { defaultValue: "Danışmanlık seansları" }),
        t("home.servicesList.consulting.bullets.1", { defaultValue: "Influencer pazarlama" }),
        t("home.servicesList.consulting.bullets.2", { defaultValue: "Strateji geliştirme" }),
        t("home.servicesList.consulting.bullets.3", { defaultValue: "Kampanya optimizasyonu" }),
        t("home.servicesList.consulting.bullets.4", { defaultValue: "ROI analizi" }),
      ],
      cta: t("home.servicesList.consulting.cta", { defaultValue: "Randevu al" }),
      to: "/iletisim",
      image: home4,
      badge: t("home.servicesList.consulting.badge", { defaultValue: "XP" }),
      label: t("home.servicesList.consulting.label", { defaultValue: "Uzman Danışmanlık" }),
      reverse: true,
    },
  ];

  return (
    <FadeIn as="section" className="services-section" distance={32}>
      <div className="mx-auto max-w-[1200px] px-6 space-y-16">
        <FadeInStagger as="div" className="space-y-16" stagger={0.18}>
          {services.map((service) => (
            <FadeInItem key={service.index} distance={24}>
              <ServiceFeature
                index={service.index}
                title={service.title}
                description={service.description}
                bullets={service.bullets}
                ctaText={service.cta}
                to={service.to}
                image={service.image}
                imageBadge={service.badge}
                imageLabel={service.label}
                reverse={service.reverse}
              />
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </FadeIn>
  );
};

export default ServicesList;

