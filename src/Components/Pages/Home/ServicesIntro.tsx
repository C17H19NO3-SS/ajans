import { useTranslation } from "react-i18next";
import { FadeIn, FadeInItem, FadeInStagger } from "@/Components/Common/Motion";

export const ServicesIntro = () => {
  const { t } = useTranslation("common");
  return (
    <FadeIn as="section" className="what-we-do" distance={30}>
      <div className="container mx-auto max-w-[900px] px-6">
        <FadeInStagger className="flex flex-col items-center text-center" stagger={0.12}>
          <FadeInItem className="flex justify-center mb-6">
            <span className="inline-grid place-items-center w-14 h-14 rounded-full bg-[rgba(59,90,187,0.08)] shadow-[0_10px_25px_rgba(59,90,187,0.15)]">
              <i className="fas fa-rocket text-[color:var(--primary-color)] text-xl" />
            </span>
          </FadeInItem>
          <FadeInItem as="h2" className="text-[1.75rem] md:text-[2rem] font-extrabold text-[color:var(--secondary-color)]">
            {t("home.servicesIntro.title", { defaultValue: "Dijital Pazarlama Hizmetlerimiz" })}
          </FadeInItem>
          <FadeInItem as="p">
            {t("home.servicesIntro.desc", { defaultValue: "Sosyal medya yönetiminden sanal turlara kadar kapsamlı çözümler sunuyoruz." })}
          </FadeInItem>
        </FadeInStagger>
      </div>
    </FadeIn>
  );
};

export default ServicesIntro;

