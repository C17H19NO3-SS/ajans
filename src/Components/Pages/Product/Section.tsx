// src/Components/Pages/Product/ProductsSection.tsx
import { useTranslation } from "react-i18next";
import type { Product } from "@/Types/Product";
import SectionTitle from "@/Components/Layout/Section/Title";
import LoadingSpinner from "@/Components/Layout/Loading/Spinner";
import Button from "@/Components/Layout/Button/Button";
import ProductCard from "@/Components/Layout/Product/Card";

type Props = {
  products: Product[];
  loading: boolean;
  loadingMore?: boolean;
  error: string | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
};

export default function ProductsSection({
  products,
  loading,
  loadingMore = false,
  error,
  hasMore = false,
  onLoadMore,
}: Props) {
  const { t } = useTranslation("common");

  if (loading && products.length === 0) {
    return (
      <section id="urunler" className="py-12">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionTitle
            icon="fas fa-box-open"
            title1={t("products.section.title1", {
              defaultValue: "Profesyonel Dijital",
            })}
            title2={t("products.section.title2", { defaultValue: "Cozumler" })}
            subtitle={t("products.section.subtitle", {
              defaultValue: "Dijital hizmet paketlerimizi kesfedin",
            })}
          />
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="urunler" className="py-12">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionTitle
            icon="fas fa-box-open"
            title1={t("products.section.title1", {
              defaultValue: "Profesyonel Dijital",
            })}
            title2={t("products.section.title2", { defaultValue: "Cozumler" })}
            subtitle={t("products.section.subtitle", {
              defaultValue: "Dijital hizmet paketlerimizi kesfedin",
            })}
          />
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <i className="mb-4 text-3xl text-red-500 fas fa-exclamation-triangle" />
            <h4 className="text-lg font-semibold text-slate-600">
              {t("products.error.title", {
                defaultValue: "Urunler yuklenirken bir hata olustu",
              })}
            </h4>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              {t("products.error.retry", { defaultValue: "Tekrar Dene" })}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="urunler" className="py-12">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionTitle
          icon="fas fa-box-open"
          title1={t("products.section.title1", {
            defaultValue: "Profesyonel Dijital",
          })}
          title2={t("products.section.title2", { defaultValue: "Cozumler" })}
          subtitle={t("products.section.subtitle", {
            defaultValue: "Dijital hizmet paketlerimizi kesfedin",
          })}
        />

        {products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <h4 className="text-lg font-semibold text-slate-600">
              {t("products.empty.title", {
                defaultValue: "Bu kriterlere uygun urun bulunamadi",
              })}
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              {t("products.empty.desc", {
                defaultValue:
                  "Filtreleri veya arama terimlerini degistirip tekrar deneyin.",
              })}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  onClick={onLoadMore}
                  disabled={loadingMore}
                  className={loadingMore ? "pointer-events-none" : ""}
                >
                  {loadingMore
                    ? t("products.section.loadingMore", {
                        defaultValue: "Yukleniyor...",
                      })
                    : t("products.section.loadMore", {
                        defaultValue: "Daha Fazla Goster",
                      })}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}