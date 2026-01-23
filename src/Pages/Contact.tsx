import AppointmentSection from "@/Components/Layout/Contact/AppoinmentSection";
import FAQSection from "@/Components/Layout/Contact/FaqSection";
import ContactHero from "@/Components/Layout/Contact/Hero";
import MapWideSection from "@/Components/Layout/Contact/MapWideSection";

export default function ContactPage() {
  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-[#f6f8ff] via-white to-[#f6f8ff]">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[rgba(76,106,255,0.18)] blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-1/2 h-80 w-80 rounded-full bg-[rgba(43,62,131,0.12)] blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-[rgba(24,34,89,0.14)] blur-[120px]" />

      <ContactHero />
      <AppointmentSection />
      <MapWideSection />
      <FAQSection />
    </main>
  );
}

