import { useTranslation } from "react-i18next";
import { FadeIn, FadeInItem, FadeInStagger } from "@/Components/Common/Motion";

type Stat = {
  icon: string;
  value: string;
  label: string;
};

export const StatsSection = () => {
  const { t } = useTranslation("common");
  const stats: Stat[] = [
    { icon: "fa-chart-line", value: t("home.stats.growth.value", { defaultValue: "%150" }), label: t("home.stats.growth.label", { defaultValue: "Ortalama büyüme" }) },
    { icon: "fa-camera", value: t("home.stats.drone.value", { defaultValue: "500+" }), label: t("home.stats.drone.label", { defaultValue: "Drone çekimi" }) },
    { icon: "fa-users", value: t("home.stats.clients.value", { defaultValue: "200+" }), label: t("home.stats.clients.label", { defaultValue: "Mutlu müşteri" }) },
    { icon: "fa-share-alt", value: t("home.stats.social.value", { defaultValue: "1000+" }), label: t("home.stats.social.label", { defaultValue: "Sosyal hesap yönetimi" }) },
  ];

  return (
    <FadeIn as="section" className="stats-section" distance={28}>
      <div className="mx-auto max-w-[1200px] px-6">
        <FadeInStagger className="grid grid-cols-2 gap-8 py-6 md:grid-cols-4 md:gap-10" stagger={0.1}>
          {stats.map((s, idx) => (
            <FadeInItem key={idx} className="stat-item" distance={16}>
              <div className="flex items-center justify-center gap-3">
                <span className="inline-grid place-items-center w-14 h-14 rounded-full bg-[rgba(59,90,187,0.08)] shadow-[0_10px_25px_rgba(59,90,187,0.15)]">
                  <i className={`fas ${s.icon} text-[color:var(--primary-color)] text-xl`} />
                </span>
                <span className="number">{s.value}</span>
              </div>
              <div className="text mt-2">{s.label}</div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </FadeIn>
  );
};

export default StatsSection;

