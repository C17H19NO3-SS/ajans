// src/Components/Products/ProductCard.tsx
import { useTranslation } from "react-i18next";
import { siteConfig } from "@/data/site";
import type { Product } from "@/Types/Product";
import Button from "../Button/Button";

export default function ProductCard({ product }: { product: Product }) {
  const { t } = useTranslation("common");
  const phoneHref = siteConfig.contact.phoneHref || siteConfig.contact.phone;
  const href = `/urunler/${product.id}`;
  const priceLabel =
    product.price ||
    t("products.card.ask", { defaultValue: "Teklif için iletişim" });

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-[color:var(--primary-color)] focus-within:ring-[color:var(--primary-color)]">
      {/* SABİT YÜKSEKLİKTE GÖRSEL ALANI */}
      <a href={href} aria-label={product.title} className="relative block">
        <div className="relative w-full overflow-hidden" /* sabit yükseklik */>
          <div className="flex justify-center items-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                loading="lazy"
                className="inset-0 block w-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                <i className="fas fa-image text-4xl text-slate-400" />
              </div>
            )}
          </div>

          {/* Üst etiketler */}
          {product.badge && (
            <span className="absolute left-3 top-3 rounded-md bg-[rgba(59,90,187,0.95)] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
              {product.badge}
            </span>
          )}
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200 backdrop-blur">
            {product.categoryTitle || product.category}
          </span>

          {/* Alt bant + hover CTA */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[color:var(--primary-color)] ring-1 ring-slate-200 backdrop-blur">
              {priceLabel}
            </span>
            <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="rounded-full bg-[color:var(--primary-color)]/90 px-3 py-1 text-xs font-semibold text-white shadow">
                {t("products.card.view", { defaultValue: "İncele" })}
              </span>
            </span>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </div>
      </a>

      {/* İçerik */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-6 text-slate-900">
          <a href={href} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {product.title}
          </a>
        </h3>

        <p className="mt-2 line-clamp-3 text-sm text-slate-600">
          {product.description ||
            t("products.card.noDescription", {
              defaultValue: "Açıklama bulunmuyor.",
            })}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Button href={`tel:${phoneHref}`} size="sm">
            <i className="fas fa-phone mr-2" />
            {t("products.card.call", { defaultValue: "Ara" })}
          </Button>
          <Button href={href} size="sm" variant="outline">
            {t("products.card.view", { defaultValue: "İncele" })}
          </Button>
        </div>
      </div>
    </article>
  );
}
