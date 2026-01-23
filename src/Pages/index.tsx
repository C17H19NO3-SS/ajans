import { StatsSection } from "@/Components/Pages/Home/StatsSection";
import { ServicesIntro } from "@/Components/Pages/Home/ServicesIntro";
import { ServicesList } from "@/Components/Pages/Home/ServicesList";
import { HeroSection } from "@/Components/Pages/Home/HeroSection";

export const Index = (): React.JSX.Element => {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesIntro />
      <ServicesList />
    </>
  );
};
