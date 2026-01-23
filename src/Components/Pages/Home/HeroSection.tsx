import { useTranslation } from "react-i18next";
import heroimg from "@/Images/hero.avif";
import { FadeIn, FadeInItem, FadeInStagger } from "@/Components/Common/Motion";

export const HeroSection = () => {
  const { t } = useTranslation("common");
  return (
    <FadeIn as="section" className="hero-section" distance={42}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeInStagger className="order-2 lg:order-1" stagger={0.16}>
            <FadeInItem className="hero-content" distance={24}>
              <span className="inline-flex items-center rounded-full border border-[rgba(59,90,187,0.2)] bg-[rgba(59,90,187,0.1)] text-[color:var(--primary-color)] shadow-[0_5px_15px_rgba(59,90,187,0.1)] px-4 py-2 text-[0.9rem] font-semibold mb-6">
                {t("home.hero.badge", { defaultValue: "Dijital Pazarlama Ajansi" })}
              </span>
              <h1 className="text-[2.8rem] font-extrabold leading-[1.2] text-[color:var(--secondary-color)] mb-6">
                {t("home.hero.title", { defaultValue: "Markanizi dijital dunyada buyutin" })}
              </h1>
              <p className="text-[1.1rem] leading-[1.7] text-[color:var(--text-light)] mb-8 max-w-[44rem]">
                {t("home.hero.desc", { defaultValue: "Sosyal medya yonetimi, reklam kampanyalari, icerik uretimi ve sanal tur hizmetleri ile markanizi guclendiriyoruz." })}
              </p>
              <div className="flex gap-3">
                <a
                  href="/urunler"
                  className="inline-flex items-center rounded-md border border-[color:var(--primary-color)] text-[color:var(--primary-color)] px-6 py-3 font-semibold shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-[3px] hover:bg-[color:var(--primary-color)] hover:text-white"
                >
                  {t("home.hero.cta", { defaultValue: "Hizmetlerimizi inceleyin" })}
                </a>
              </div>
            </FadeInItem>
          </FadeInStagger>

          <FadeIn as="div" className="order-1 lg:order-2" direction="up" distance={36} delay={0.12}>
            <div className="relative">
              <img
                src={heroimg}
                alt={t("home.hero.imageAlt", { defaultValue: "Dijital cozumler" })}
                className="w-full rounded-[10px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-transform duration-500 hover:-translate-y-[5px]"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </FadeIn>
  );
};
