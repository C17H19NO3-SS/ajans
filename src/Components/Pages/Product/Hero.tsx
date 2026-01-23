// src/Components/Pages/Product/ProductsHero.tsx
import Button from "@/Components/Layout/Button/Button";
import { useTranslation } from "react-i18next";
import { FadeIn, FadeInItem, FadeInStagger } from "@/Components/Common/Motion";

export default function ProductsHero() {
  const { t } = useTranslation("common");
  return (
    <FadeIn as="section" className="hero-section" distance={40}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeInStagger as="div" className="mb-8 lg:mb-0" stagger={0.15}>
            <FadeInItem className="hero-content" distance={26}>
              <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 font-semibold text-[color:var(--primary-color)]">
                {t("products.hero.badge", { defaultValue: "Dijital Cozumler" })}
              </span>
              <h1 className="mt-4 text-4xl font-extrabold text-[color:var(--secondary-color)]">
                {t("products.hero.title1", { defaultValue: "Urun ve" })}{" "}
                <span className="text-[color:var(--primary-color)]">
                  {t("products.hero.title2", { defaultValue: "Hizmetlerimiz" })}
                </span>
              </h1>
              <p className="mt-4 text-lg leading-7 text-slate-600">
                {t("products.hero.desc", {
                  defaultValue:
                    "Isinizi buyutmek icin ihtiyaciniz olan her tur dijital cozumu sunuyoruz.",
                })}
              </p>
              <FadeInStagger className="mt-6 flex gap-3" stagger={0.12}>
                <FadeInItem>
                  <Button href="/iletisim">
                    {t("products.hero.ctaPrimary", {
                      defaultValue: "Hemen Iletisime Gecin",
                    })}
                  </Button>
                </FadeInItem>
                <FadeInItem>
                  <Button variant="outline" href="#urunler">
                    {t("products.hero.ctaSecondary", {
                      defaultValue: "Urunleri inceleyin",
                    })}
                  </Button>
                </FadeInItem>
              </FadeInStagger>
            </FadeInItem>
          </FadeInStagger>
          <FadeIn as="div" className="relative" direction="up" distance={32} delay={0.1}>
            <img
              src="https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&w=1400&q=80"
              alt={t("products.hero.imgAlt", {
                defaultValue: "Dijital urunler",
              })}
              className="w-full rounded-xl object-cover shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
            />
            <FadeInItem as="div" className="absolute right-0 top-0 hidden h-20 w-20 -translate-y-1/2 place-items-center rounded-full bg-white p-3 shadow md:grid" direction="down" distance={12}>
              <i className="fas fa-laptop-code text-3xl text-[color:var(--primary-color)]" />
            </FadeInItem>
            <FadeInItem as="div" className="absolute left-0 bottom-0 hidden h-20 w-20 translate-y-1/2 place-items-center rounded-full bg-white p-3 shadow md:grid" direction="up" distance={12}>
              <i className="fas fa-mobile-alt text-3xl text-[color:var(--primary-color)]" />
            </FadeInItem>
          </FadeIn>
        </div>
      </div>
    </FadeIn>
  );
}
