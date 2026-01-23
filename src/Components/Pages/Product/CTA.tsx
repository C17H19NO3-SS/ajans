// src/Components/Pages/Product/ProductsCTA.tsx
import { useTranslation } from "react-i18next";
import { siteConfig } from "@/data/site";
import Button from "@/Components/Layout/Button/Button";

export default function ProductsCTA() {
  const { t } = useTranslation("common");
  const phoneHref = siteConfig.contact.phoneHref || siteConfig.contact.phone;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[900px] px-6 text-center">
        <span className="mb-4 inline-grid h-16 w-16 place-items-center rounded-full bg-indigo-50 text-indigo-600">
          <i className="fas fa-rocket" />
        </span>
        <h2 className="text-3xl font-bold text-[color:var(--secondary-color)]">
          {t("products.cta.title", {
            defaultValue: "Ozel bir projeniz mi var?",
          })}
        </h2>
        <p className="mt-3 text-lg text-slate-600">
          {t("products.cta.desc", {
            defaultValue: "Size ozel cozumler gelistirebiliriz.",
          })}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button size="lg" href="/iletisim">
            <i className="fas fa-phone mr-2" />
            {t("products.cta.primary", { defaultValue: "Hemen Iletisime Gec" })}
          </Button>
          <Button size="lg" variant="outline" href={`tel:${phoneHref}`}>
            {t("products.cta.secondary", { defaultValue: "Telefon Et" })}
          </Button>
        </div>
      </div>
    </section>
  );
}
